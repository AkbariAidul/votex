// ... di dalam komponen ElectionDetailClientUI

const [subject, setSubject] = useState('');
const [message, setMessage] = useState('');
const [isSending, setIsSending] = useState(false);

const handleSendNotification = async () => {
    setIsSending(true);
    const { data, error } = await supabase.functions.invoke('send-election-reminder', {
        body: { election_id: election.id, subject, message }
    });
    if(error) alert('Gagal mengirim: ' + error.message);
    if(data) alert(data.message);
    setIsSending(false);
}

return (
    // ... JSX untuk tab Kandidat dan Pemilih ...

    {/* KONTEN TAB 3: NOTIFIKASI */}
    <div className="hidden p-4 rounded-lg bg-gray-800" id="notifications" role="tabpanel">
        <h3 className="text-xl font-semibold text-white mb-4">Kirim Notifikasi Email ke Pemilih</h3>
        <div className="space-y-4 max-w-lg">
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white mb-1">Subjek Email</label>
                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="bg-gray-700 w-full rounded-lg p-2"/>
            </div>
             <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-1">Isi Pesan</label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="bg-gray-700 w-full rounded-lg p-2"></textarea>
            </div>
            <button onClick={handleSendNotification} disabled={isSending} className="bg-cyan-600 text-white px-5 py-2 rounded-lg disabled:bg-gray-500">
                {isSending ? 'Mengirim...' : 'Kirim ke Semua Pemilih'}
            </button>
        </div>
    </div>
)