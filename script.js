const CATS=[
  {ic:'ti-code',name:'Teknologi & IT',ct:'38 lomba',bg:'#EEF2FD',bgi:'#C5D4FB',ci:'#1239C4',id:'tech'},
  {ic:'ti-palette',name:'Seni & Desain',ct:'24 lomba',bg:'#FEF0EC',bgi:'#FBC9B8',ci:'#C43C14',id:'seni'},
  {ic:'ti-microscope',name:'Sains & Riset',ct:'18 lomba',bg:'#E5F7F2',bgi:'#9DE4CE',ci:'#006B4C',id:'sains'},
  {ic:'ti-pencil',name:'Menulis & Sastra',ct:'14 lomba',bg:'#F0EEFF',bgi:'#C4B5FD',ci:'#5B21B6',id:'tulis'},
  {ic:'ti-music',name:'Musik & Seni Pertunjukan',ct:'20 lomba',bg:'#FDF0F6',bgi:'#F5B8D8',ci:'#9D174D',id:'musik'},
  {ic:'ti-ball-football',name:'Olahraga',ct:'31 lomba',bg:'#FEF9EC',bgi:'#FCD970',ci:'#92400E',id:'sport'},
];

const EVS=[
  {ic:'ti-cpu',ibg:'#EEF2FD',ic2:'#1239C4',tag:'Teknologi',tc:'ch-b',title:'National Olympiad Informatika 2025',loc:'Online · SMA/SMK',prize:'Total Rp 50jt',dl:'30 Jun 2025',badge:'Populer',bc:'ch-b'},
  {ic:'ti-layout',ibg:'#FEF0EC',ic2:'#C43C14',tag:'Seni & Desain',tc:'ch-o',title:'Lomba Desain Poster Kemerdekaan RI',loc:'Nasional · SMP–SMA',prize:'Piala + Sertifikat',dl:'1 Jul 2025',badge:'Baru',bc:'ch-o'},
  {ic:'ti-flask',ibg:'#E5F7F2',ic2:'#006B4C',tag:'Sains',tc:'ch-g',title:'Karya Ilmiah Remaja Tingkat Provinsi',loc:'Offline · SMP–SMA',prize:'Beasiswa + Medali',dl:'15 Jul 2025',badge:'Deadline Dekat',bc:'ch-g'},
];

const QS=[
  {q:'Waktu luang kamu biasanya dihabiskan untuk apa?',h:'Pilih yang paling sering kamu lakukan',opts:[{ic:'ti-device-gamepad',t:'Main game atau coding'},{ic:'ti-brush',t:'Menggambar atau berkreasi'},{ic:'ti-book-2',t:'Membaca atau menulis'},{ic:'ti-run',t:'Olahraga atau aktivitas fisik'}]},
  {q:'Dalam proyek kelompok, kamu paling suka jadi…',h:'Pilih peran yang paling bikin kamu nyaman',opts:[{ic:'ti-bulb',t:'Pemikir dan perencana strategi'},{ic:'ti-microphone',t:'Presenter dan komunikator'},{ic:'ti-tools',t:'Eksekutor yang kerja nyata'},{ic:'ti-vector-triangle',t:'Desainer dan kreatif visual'}]},
];

let qi=0,ans=[],dark=false;

// Fungsi Navigasi Halaman
function go(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  const pg=document.getElementById('pg-'+id);
  if(pg){pg.classList.add('on');window.scrollTo(0,0)}
  if(id==='quiz'){qi=0;ans=[];renderQ()}
}

function setNav(k){
  document.querySelectorAll('.bi').forEach(b=>b.classList.remove('on'));
  const el=document.getElementById('nav-'+k);
  if(el)el.classList.add('on');
}

// Fitur Dark Mode
function toggleDark(){
  dark=!dark;
  document.body.toggleAttribute('data-dark',dark);
  const ic=document.getElementById('dark-ic');
  ic.className=dark?'ti ti-sun':'ti ti-moon';
}

// Render Data ke HTML
function renderCats(){
  document.getElementById('cat-list').innerHTML=CATS.map(c=>`<div class="ccat" onclick="toast('Filter: ${c.name}')" style="background:${c.bg}"><div class="ccat-ic" style="background:${c.bgi+'33'}"><i class="ti ${c.ic}" style="color:${c.ci}"></i></div><div class="ccat-name">${c.name}</div><div class="ccat-ct">${c.ct}</div></div>`).join('');
}

function renderEvs(){
  document.getElementById('ev-list').innerHTML=EVS.map(e=>`<div class="ecard"><div class="ecard-top" style="background:${e.ibg}"><i class="ti ${e.ic}" style="color:${e.ic2}"></i></div><div class="ecard-body"><div class="ecard-title">${e.title}</div><div class="ecard-foot"><span class="prize">${e.prize}</span></div></div></div>`).join('');
}

// Logika Kuis
function renderQ(){
  const q=QS[qi];
  document.getElementById('q-chat').innerHTML=`<div class="q-text">${q.q}</div>`;
  document.getElementById('qopts').innerHTML=q.opts.map((o,i)=>`<div class="qopt" onclick="ans[qi]=${i};nextQ()"><i class="ti ${o.ic}"></i> ${o.t}</div>`).join('');
}

function nextQ(){
  if(qi<QS.length-1){qi++;renderQ()}else{go('result');}
}

// Notifikasi Toast
function toast(msg){
  document.getElementById('toast-msg').textContent=msg;
  const t=document.getElementById('toast');
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2000);
}

// Inisialisasi awal
renderCats();
renderEvs();
