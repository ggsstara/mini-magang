// ─── Types ──────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  avatar: string; // single uppercase letter used as avatar
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export const CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Chatrigo Assistant",
    avatar: "C",
    lastMessage: "Halo! Apa yang bisa saya bantu hari ini?",
    time: "10:32",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Marketing Bot",
    avatar: "M",
    lastMessage: "Kampanye terbaru sudah siap untuk review.",
    time: "09:15",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Support Team",
    avatar: "S",
    lastMessage: "Tiket #4821 telah diselesaikan.",
    time: "Kemarin",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Data Analyst",
    avatar: "D",
    lastMessage: "Laporan Q4 sudah tersedia.",
    time: "Kemarin",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Dev Assistant",
    avatar: "D",
    lastMessage: "Build pipeline berhasil. All green ✅",
    time: "Senin",
    unread: 0,
    online: true,
  },
  {
    id: "6",
    name: "HR Chatbot",
    avatar: "H",
    lastMessage: "Pengajuan cuti Anda telah disetujui.",
    time: "Senin",
    unread: 3,
    online: false,
  },
  {
    id: "7",
    name: "Finance Bot",
    avatar: "F",
    lastMessage: "Reimbursement bulan ini sudah diproses.",
    time: "Minggu lalu",
    unread: 0,
    online: false,
  },
];

// ─── Dummy messages per conversation ─────────────────────────────────────────

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "1-1", sender: "bot", text: "Selamat pagi! 👋 Saya adalah Chatrigo Assistant. Bagaimana saya bisa membantu Anda hari ini?", time: "10:20" },
    { id: "1-2", sender: "user", text: "Halo, saya butuh bantuan dengan project baru.", time: "10:21" },
    { id: "1-3", sender: "bot", text: "Tentu saja! Bisa Anda ceritakan lebih detail tentang project tersebut? Saya siap membantu dari sisi perencanaan hingga implementasi.", time: "10:22" },
    { id: "1-4", sender: "user", text: "Saya ingin membuat aplikasi e-commerce berbasis React.", time: "10:28" },
    { id: "1-5", sender: "bot", text: "Aplikasi e-commerce berbasis React adalah pilihan yang sangat populer dan powerful! Saya akan membantu Anda merancang arsitektur, memilih library yang tepat, dan menyusun roadmap pengembangan. Dari mana kita mulai?", time: "10:29" },
    { id: "1-6", sender: "user", text: "Mulai dari arsitektur dulu.", time: "10:30" },
    { id: "1-7", sender: "bot", text: "Halo! Apa yang bisa saya bantu hari ini?", time: "10:32" },
  ],
  "2": [
    { id: "2-1", sender: "bot", text: "Marketing Bot siap membantu Anda dengan strategi dan konten pemasaran digital.", time: "08:00" },
    { id: "2-2", sender: "user", text: "Bisa bantu bikin outline untuk konten blog?", time: "08:30" },
    { id: "2-3", sender: "bot", text: "Dengan senang hati! Bisa Anda berikan topik utama dan target audiensi yang Anda inginkan?", time: "08:31" },
    { id: "2-4", sender: "user", text: "Topiknya tentang AI dan transformasi bisnis.", time: "08:45" },
    { id: "2-5", sender: "bot", text: "Kampanye terbaru sudah siap untuk review.", time: "09:15" },
  ],
  "3": [
    { id: "3-1", sender: "bot", text: "Selamat datang di Support Team. Nomor tiket Anda telah direkam.", time: "09:00" },
    { id: "3-2", sender: "user", text: "Aplikasi saya sering crash di halaman dashboard.", time: "09:10" },
    { id: "3-3", sender: "bot", text: "Kami sedang menginvestasi masalah ini. Tiket #4821 telah dibuat dan tim engineering sudah dihubungi.", time: "09:12" },
    { id: "3-4", sender: "bot", text: "Tiket #4821 telah diselesaikan.", time: "14:00" },
  ],
  "4": [
    { id: "4-1", sender: "bot", text: "Data Analyst Bot online. Siap membantu Anda menganalisis data dan menghasilkan insight.", time: "07:00" },
    { id: "4-2", sender: "user", text: "Tolong buatkan summary dari data penjualan Q4.", time: "11:00" },
    { id: "4-3", sender: "bot", text: "Sedang memproses data... Mohon tunggu sebentar.", time: "11:01" },
    { id: "4-4", sender: "bot", text: "Laporan Q4 sudah tersedia.", time: "11:05" },
  ],
  "5": [
    { id: "5-1", sender: "bot", text: "Dev Assistant siap. Hubungkan dengan repo atau ajukan pertanyaan teknis Anda.", time: "08:00" },
    { id: "5-2", sender: "user", text: "Deploy ke staging gagal, ada error di CI.", time: "10:00" },
    { id: "5-3", sender: "bot", text: "Saya sedang memeriksa log CI. Tampaknya ada dependency conflict di package.json.", time: "10:02" },
    { id: "5-4", sender: "user", text: "Sudah dicoba update, tapi masih stuck.", time: "10:10" },
    { id: "5-5", sender: "bot", text: "Build pipeline berhasil. All green ✅", time: "10:25" },
  ],
  "6": [
    { id: "6-1", sender: "bot", text: "Selamat datang di HR Chatbot. Kami siap membantu kebutuhan HR Anda.", time: "09:00" },
    { id: "6-2", sender: "user", text: "Saya ingin mengajukan cuti untuk minggu depan.", time: "09:30" },
    { id: "6-3", sender: "bot", text: "Pengajuan cuti Anda telah diterima. Menunggu persetujuan dari manager.", time: "09:31" },
    { id: "6-4", sender: "bot", text: "Pengajuan cuti Anda telah disetujui.", time: "10:45" },
  ],
  "7": [
    { id: "7-1", sender: "bot", text: "Finance Bot siap membantu urusan keuangan dan reimbursement Anda.", time: "08:00" },
    { id: "7-2", sender: "user", text: "Status reimbursement bulan ini bagaimana?", time: "09:00" },
    { id: "7-3", sender: "bot", text: "Reimbursement bulan ini sudah diproses.", time: "09:01" },
  ],
};

// ─── Dummy bot replies (cycled for new messages) ─────────────────────────────

export const DUMMY_BOT_REPLIES: string[] = [
  "Terima kasih atas pesan Anda! Saya sedang memproses informasi tersebut. 🤔",
  "Poin yang sangat bagus! Mari kita diskusikan lebih lanjut.",
  "Saya mengerti. Biarkan saya cari solusi terbaik untuk Anda.",
  "Informasi Anda telah diterima. Akan segera saya tindaklanjuti.",
  "Sounds great! Saya akan membantu Anda menyelesaikan hal ini sekarang.",
  "Menarik sekali! Bisa Anda berikan lebih banyak detail untuk saya proses?",
  "Oke, saya akan menganalisis hal tersebut dan memberikan rekomendasi terbaik.",
  "Done! Hasilnya sudah saya siapkan untuk Anda. ✅",
  "Sempurna, langkah selanjutnya akan saya atur otomatis.",
  "Baru saja saya periksa — semuanya berjalan lancar di sisi server. 🟢",
];
