
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, Activity } from 'lucide-react';

export interface PolicyProps {
  id: string;
  type: string;
  coverageAmount: string;
  status: 'active' | 'inactive' | 'pending';
  startDate: string;
  endDate: string;
}

export function PolicyCard({ policy }: { policy: PolicyProps }) {
  return (
    <div className="health-card">
      <div className="health-card-inner">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{policy.type}</h3>
            <p className="text-sm text-muted-foreground">Complaint #{policy.id}</p>
          </div>
          <Badge className={
            policy.status === 'active' 
              ? 'bg-green-500' 
              : policy.status === 'pending'
                ? 'bg-yellow-500' 
                : 'bg-red-500'
          }>
            {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
          </Badge>
        </div>
        
        <div className="my-4">
          <div className="flex items-center gap-2 mt-4">
            <Shield className="h-4 w-4 text-health-blue" />
            <span className="font-medium">Coverage:</span>
            <span>{policy.coverageAmount} ETH</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-health-blue" />
            <span className="font-medium">location:</span>
            <span className="text-sm">
              {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Activity className="h-4 w-4 text-health-blue" />
            <span className="font-medium">Status:</span>
            <span>
              {policy.status === 'active' && 'Active and covered'}
              {policy.status === 'pending' && 'Processing payment'}
              {policy.status === 'inactive' && 'Coverage ended'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
