// 1) เมนูมือถือ (hamburger)
function initMenu(){
  const b=document.getElementById('menuBtn'), n=document.getElementById('mainNav');
  b.addEventListener('click',()=>{
    const o=n.classList.toggle('open');
    b.setAttribute('aria-expanded',o);
    b.setAttribute('aria-label',o?'ปิดเมนู':'เปิดเมนู');
  });
}

// 2) สลับโหมดสว่าง/มืด (จำค่าไว้ใน localStorage)
function initTheme(){
  const r=document.documentElement, s=localStorage.getItem('theme');
  if(s) r.dataset.theme=s;
  document.getElementById('themeBtn').addEventListener('click',()=>{
    const t=r.dataset.theme==='dark'?'light':'dark';
    r.dataset.theme=t;
    localStorage.setItem('theme',t);
  });
}

// 3) ค้นหา/กรองสถานที่
function initFilter(){
  const q=document.getElementById('q'), c=document.getElementById('cat'),
        cards=[...document.querySelectorAll('#list .card')], empty=document.getElementById('empty');
  const run=()=>{
    const k=q.value.trim().toLowerCase(); let n=0;
    cards.forEach(d=>{
      const ok=d.dataset.title.toLowerCase().includes(k)&&(!c.value||d.dataset.cat===c.value);
      d.hidden=!ok; if(ok) n++;
    });
    empty.hidden=n>0;
  };
  q.addEventListener('input',run);
  c.addEventListener('change',run);
}

// 4) ตรวจสอบแบบฟอร์ม
function initForm(){
  const f=document.getElementById('contactForm');
  const rules={
    name:v=>v.trim().length>=2||'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร',
    email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||'รูปแบบอีเมลไม่ถูกต้อง เช่น name@example.com',
    phone:v=>v===''||/^0\d{8,9}$/.test(v)||'เบอร์โทรต้องขึ้นต้นด้วย 0 และมี 9-10 หลัก',
    msg:v=>v.trim().length>=10||'ข้อความต้องมีอย่างน้อย 10 ตัวอักษร'
  };
  const check=id=>{
    const el=f.elements[id], r=rules[id](el.value), e=document.getElementById(id+'Err');
    el.classList.toggle('invalid',r!==true);
    el.setAttribute('aria-invalid',r!==true);
    e.textContent=r===true?'':r;
    return r===true;
  };
  Object.keys(rules).forEach(id=>f.elements[id].addEventListener('blur',()=>check(id)));
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const ok=Object.keys(rules).map(check).every(Boolean);
    document.getElementById('ok').hidden=!ok;
    if(ok) f.reset();
  });
}

// 5) ดึงข้อมูลอากาศจาก Open-Meteo (async/await + loading + error handling)
const WX={0:'ท้องฟ้าแจ่มใส',1:'แทบไม่มีเมฆ',2:'มีเมฆบางส่วน',3:'เมฆมาก',45:'มีหมอก',48:'มีหมอก',51:'ฝนปรอย',53:'ฝนปรอย',55:'ฝนปรอยหนัก',61:'ฝนเล็กน้อย',63:'ฝนปานกลาง',65:'ฝนหนัก',80:'ฝนฟ้าคะนองเป็นช่วง',81:'ฝนตกเป็นช่วง',82:'ฝนตกหนัก',95:'พายุฝนฟ้าคะนอง',96:'พายุฝนฟ้าคะนอง',99:'พายุฝนฟ้าคะนอง'};

async function loadWeather(){
  const box=document.getElementById('weather');
  const url='https://api.open-meteo.com/v1/forecast?latitude=14.99&longitude=103.10&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FBangkok';
  try{
    const res=await fetch(url);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const c=(await res.json()).current;
    box.innerHTML=`<div class="wx"><strong>${Math.round(c.temperature_2m)}°C</strong><span>${WX[c.weather_code]||'ไม่ทราบสภาพอากาศ'}</span><span>ความชื้น ${c.relative_humidity_2m}%</span><span>ลม ${c.wind_speed_10m} กม./ชม.</span></div>`;
  }catch(err){
    box.innerHTML='<p class="error">โหลดข้อมูลอากาศไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วรีเฟรชหน้านี้</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  initMenu(); initTheme();
  if(document.getElementById('list')) initFilter();
  if(document.getElementById('contactForm')) initForm();
  if(document.getElementById('weather')) loadWeather();
});
