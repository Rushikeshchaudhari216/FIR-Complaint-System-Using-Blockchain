import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface InsuranceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

export function InsuranceForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: InsuranceFormProps) {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    coverageAmount: 0,
    premium: 0,
    deductible: 0,
    effectiveDate: "",
    expiryDate: "",
    coverageDetails: "",
  });

  // Reset form or populate with initial data when opened
  useEffect(() => {
    if (initialData) {
      // Format dates for date inputs (YYYY-MM-DD)
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        _id: initialData._id || "",
        name: initialData.name || "",
        coverageAmount: initialData.coverageAmount || 0,
        premium: initialData.premium || 0,
        deductible: initialData.deductible || 0,
        effectiveDate: formatDate(initialData.effectiveDate) || "",
        expiryDate: formatDate(initialData.expiryDate) || "",
        coverageDetails: initialData.coverageDetails || "",
      });
    } else {
      // Reset form for new policy
      setFormData({
        _id: "",
        name: "",
        coverageAmount: 0,
        premium: 0,
        deductible: 0,
        effectiveDate: "",
        expiryDate: "",
        coverageDetails: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (["coverageAmount", "premium", "deductible"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Insurance Policy" : "Add New Insurance Policy"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Policy Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverageAmount">Coverage Amount ($)</Label>
              <Input
                id="coverageAmount"
                name="coverageAmount"
                type="number"
                value={formData.coverageAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="premium">Premium ($)</Label>
              <Input
                id="premium"
                name="premium"
                type="number"
                value={formData.premium}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductible">Deductible ($)</Label>
              <Input
                id="deductible"
                name="deductible"
                type="number"
                value={formData.deductible}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                name="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverageDetails">Coverage Details</Label>
            <Textarea
              id="coverageDetails"
              name="coverageDetails"
              value={formData.coverageDetails}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Policy" : "Create Policy"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
