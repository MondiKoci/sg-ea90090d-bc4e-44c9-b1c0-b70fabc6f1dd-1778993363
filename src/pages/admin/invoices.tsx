import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { invoiceService } from "@/services/invoiceService";
import { patientService } from "@/services/patientService";
import type { InvoiceWithItems } from "@/services/invoiceService";
import type { Patient } from "@/services/patientService";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Send, DollarSign, Trash2, Edit, Check, X, FileText } from "lucide-react";

export default function AdminInvoicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithItems | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceWithItems | null>(null);
  
  const [formData, setFormData] = useState({
    patient_id: "",
    due_date: "",
    tax_rate: 0,
    discount_amount: 0,
    notes: "",
  });
  
  const [items, setItems] = useState<Array<{ description: string; quantity: number; unit_price: number }>>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesData, patientsData] = await Promise.all([
        invoiceService.getAllInvoices(),
        patientService.getAllPatients(),
      ]);
      setInvoices(invoicesData);
      setPatients(patientsData);
    } catch (error) {
      toast({
        title: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (invoice?: InvoiceWithItems) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        patient_id: invoice.patient_id,
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : "",
        tax_rate: Number(invoice.tax_rate) || 0,
        discount_amount: Number(invoice.discount_amount) || 0,
        notes: invoice.notes || "",
      });
      setItems(invoice.items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
      })));
    } else {
      setEditingInvoice(null);
      setFormData({
        patient_id: "",
        due_date: "",
        tax_rate: 0,
        discount_amount: 0,
        notes: "",
      });
      setItems([{ description: "", quantity: 1, unit_price: 0 }]);
    }
    setDialogOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * formData.tax_rate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - formData.discount_amount;
  };

  const handleSave = async () => {
    if (!formData.patient_id) {
      toast({
        title: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    const validItems = items.filter(item => item.description && item.quantity > 0 && item.unit_price > 0);
    if (validItems.length === 0) {
      toast({
        title: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingInvoice) {
        await invoiceService.updateInvoice(editingInvoice.id, {
          due_date: formData.due_date || null,
          tax_rate: formData.tax_rate,
          discount_amount: formData.discount_amount,
          notes: formData.notes,
          subtotal: calculateSubtotal(),
          tax_amount: calculateTax(),
          total: calculateTotal(),
        } as any);
        toast({ title: "Invoice updated" });
      } else {
        await invoiceService.createInvoice(formData.patient_id, validItems, formData);
        toast({ title: "Invoice created" });
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: "Failed to save invoice",
        variant: "destructive",
      });
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    if (!confirm("Send this invoice to the patient?")) return;

    try {
      await invoiceService.sendInvoice(invoiceId);
      toast({ title: "Invoice sent to patient" });
      loadData();
    } catch (error) {
      toast({
        title: "Failed to send invoice",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    if (!confirm("Mark this invoice as paid?")) return;

    try {
      await invoiceService.markAsPaid(invoiceId);
      toast({ title: "Invoice marked as paid" });
      loadData();
    } catch (error) {
      toast({
        title: "Failed to update invoice",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Delete this invoice? This action cannot be undone.")) return;

    try {
      await invoiceService.deleteInvoice(invoiceId);
      toast({ title: "Invoice deleted" });
      loadData();
    } catch (error) {
      toast({
        title: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (invoice: InvoiceWithItems) => {
    setPreviewInvoice(invoice);
    setPreviewOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "sent": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "overdue": return "bg-red-500/10 text-red-700 border-red-500/20";
      case "draft": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-sans text-4xl font-bold mb-2">Invoices</h1>
            <p className="text-muted-foreground">Manage patient invoices and payments</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No invoices yet. Create your first invoice.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-semibold">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>
                        {invoice.patient?.full_name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${Number(invoice.total).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePreview(invoice)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {invoice.status === "draft" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenDialog(invoice)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSendInvoice(invoice.id)}
                              >
                                <Send className="w-4 h-4 text-blue-600" />
                              </Button>
                            </>
                          )}
                          {invoice.status === "sent" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsPaid(invoice.id)}
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Invoice Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
              </DialogTitle>
              <DialogDescription>
                {editingInvoice ? "Update invoice details" : "Create an invoice for a patient"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient *</Label>
                  <Select
                    value={formData.patient_id}
                    onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
                    disabled={!!editingInvoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Invoice Items *</Label>
                  <Button size="sm" variant="outline" onClick={handleAddItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 1)}
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-32 flex items-center justify-end font-semibold">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </div>
                      {items.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discount Amount</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes for the invoice"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({formData.tax_rate}%):</span>
                  <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                </div>
                {formData.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount:</span>
                    <span className="font-semibold text-red-600">-${formData.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingInvoice ? "Update Invoice" : "Create Invoice"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invoice Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>

            {previewInvoice && (
              <div className="py-6 px-8 bg-white text-black">
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-2">INVOICE</h2>
                    <p className="text-sm text-muted-foreground">
                      Invoice #: <span className="font-mono font-semibold text-foreground">{previewInvoice.invoice_number}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">Elite Dental Tourism</p>
                    <p className="text-sm text-muted-foreground">123 Dental Street</p>
                    <p className="text-sm text-muted-foreground">City, Country</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8 p-4 bg-muted/30 rounded">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">BILL TO:</p>
                    <p className="font-semibold">{previewInvoice.patient?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{previewInvoice.patient?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">INVOICE DETAILS:</p>
                    <p className="text-sm">Issue Date: {new Date(previewInvoice.issue_date).toLocaleDateString()}</p>
                    {previewInvoice.due_date && (
                      <p className="text-sm">Due Date: {new Date(previewInvoice.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b-2 border-primary">
                      <th className="text-left py-3 font-semibold">Description</th>
                      <th className="text-right py-3 font-semibold">Qty</th>
                      <th className="text-right py-3 font-semibold">Price</th>
                      <th className="text-right py-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-3">{item.description}</td>
                        <td className="text-right py-3">{Number(item.quantity)}</td>
                        <td className="text-right py-3">${Number(item.unit_price).toFixed(2)}</td>
                        <td className="text-right py-3 font-semibold">${Number(item.total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${Number(previewInvoice.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({Number(previewInvoice.tax_rate)}%):</span>
                      <span className="font-semibold">${Number(previewInvoice.tax_amount).toFixed(2)}</span>
                    </div>
                    {Number(previewInvoice.discount_amount) > 0 && (
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="font-semibold text-red-600">-${Number(previewInvoice.discount_amount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t-2 border-primary pt-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>${Number(previewInvoice.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {previewInvoice.notes && (
                  <div className="mt-8 p-4 bg-muted/30 rounded">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">NOTES:</p>
                    <p className="text-sm whitespace-pre-wrap">{previewInvoice.notes}</p>
                  </div>
                )}

                <div className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
                  <p>Thank you for choosing Elite Dental Tourism</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}