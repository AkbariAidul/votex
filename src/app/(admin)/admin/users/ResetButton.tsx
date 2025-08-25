"use client";
import { useState } from 'react';
import { resendInvite } from '@/app/(superadmin)/super/users/actions'; // Impor dari action superadmin
import { Send, Loader2 } from 'lucide-react';

export default function ResetButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        const result = await resendInvite(userId);
        if (result.success) alert(result.success);
        if (result.error) alert(result.error);
        setLoading(false);
    };

    return (
        <button 
            onClick={handleResend}
            disabled={loading}
            className="font-medium text-cyan-500 hover:underline disabled:opacity-50 inline-flex items-center gap-1"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-3 h-3"/>}
            {loading ? 'Mengirim...' : 'Reset/Undang'}
        </button>
    );
}