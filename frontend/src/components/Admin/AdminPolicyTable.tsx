import { Pen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminPolicyTable() {
  // Add real data from your backend
  const policies = [
    // Sample policy data
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Policy Name</th>
            <th className="text-left py-3 px-4">Coverage</th>
            <th className="text-left py-3 px-4">Premium</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">{policy.type}</td>
              <td className="py-3 px-4">{policy.coverageAmount} ETH</td>
              <td className="py-3 px-4">{policy.premium} ETH</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  policy.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {policy.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Pen className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}