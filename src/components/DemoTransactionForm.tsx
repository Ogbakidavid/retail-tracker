
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DemoTransactionForm = () => {
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 opacity-50 pointer-events-none">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-red-200 text-red-600">
              Expense
            </Button>
            <Button variant="outline" className="border-green-200 text-green-600">
              Income
            </Button>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="demo-amount">Amount ($)</Label>
            <Input
              id="demo-amount"
              type="number"
              placeholder="0.00"
              className="text-lg"
              disabled
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="demo-description">Description</Label>
            <Input
              id="demo-description"
              placeholder="What was this transaction for?"
              disabled
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="demo-category">Category</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office Supplies</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            disabled
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl"
          >
            Save Transaction
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoTransactionForm;
