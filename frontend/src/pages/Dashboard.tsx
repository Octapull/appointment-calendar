import { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type {
  EventInput,
  EventClickArg,
  DateSelectArg,
  EventDropArg,
} from '@fullcalendar/core';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

// Backend'den gelen randevu kaydi
interface Appointment {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
  category?: string;
}

interface NewEvent {
  title: string;
  start: string;
  end: string;
  color: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [newEvent, setNewEvent] = useState<NewEvent>({
      title: '', start: '', end: '',
      color: '#3788d8',
      category: 'is' // Varsayılan kategori
  });

  const categories: Category[] = [
    { id: 'is', name: '🏢 İş / Toplantı', color: '#3788d8' },    // Mavi
    { id: 'ozel', name: '🏠 Kişisel / Özel', color: '#28a745' }, // Yeşil
    { id: 'okul', name: '🎓 Okul / Ders', color: '#fd7e14' },    // Turuncu
    { id: 'acil', name: '🔥 Acil Durum', color: '#dc3545' },     // Kırmızı
    { id: 'diger', name: '✨ Diğer', color: '#6f42c1' }          // Mor
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get<Appointment[]>('/appointments');
      // Backend verisini FullCalendar formatına çevir
      const formattedEvents: EventInput[] = res.data.map((item) => ({
        id: String(item.id),
        title: item.title,
        start: item.start_time,
        end: item.end_time,
        backgroundColor: item.color, // <-- Rengi buraya işliyoruz
        borderColor: item.color      // <-- Kenarlığı da aynı renk yapıyoruz
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setNewEvent({
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      color: '#3788d8', // Her yeni açılışta mavi başla
      category: 'is'
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!newEvent.title) return alert('Lütfen bir başlık girin');

    try {
      await api.post('/appointments', {
        title: newEvent.title,
        start_time: newEvent.start,
        end_time: newEvent.end,
        description: "React",
        color: newEvent.color,       // Seçilen kategorinin rengi
        category: newEvent.category  // Seçilen kategorinin ismi
      });
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      alert('Kaydedilemedi');
    }
  };

  // ... (Diğer silme ve güncelleme fonksiyonları aynı kalacak) ...
  const handleEventClick = async (clickInfo: EventClickArg) => {
    if (window.confirm(`'${clickInfo.event.title}' silinsin mi?`)) {
      try {
        await api.delete(`/appointments/${clickInfo.event.id}`);
        clickInfo.event.remove();
      } catch (err) { alert('Silinemedi'); }
    }
  };

  const handleEventDrop = async (info: EventDropArg | EventResizeDoneArg) => {
    try {
      await api.put(`/appointments/${info.event.id}`, {
        start_time: info.event.startStr,
        end_time: info.event.endStr,
        // Rengi korumak için backend'e mevcut rengi de gönderebiliriz ama backend zaten eskisini koruyor.
      });
    } catch (err) { info.revert(); }
  };

  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <h2 style={{ margin: 0, color: '#333' }}>Hoşgeldin, {user?.fullName} 👋</h2>
        <button onClick={logout} className="logout-btn">Çıkış Yap</button>
      </div>

      <div className="calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          selectable={true}
          editable={true}
          events={events}
          select={handleDateSelect}
          eventDisplay="block"

          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}

          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventDrop}
          height="75vh"
          locale="tr"
          buttonText={{ today: 'Bugün', month: 'Ay', week: 'Hafta', day: 'Gün' }}
        />
      </div>

      {/* --- YENİLENMİŞ RENKLİ MODAL --- */}
      {showModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'white', padding:'30px', borderRadius:'15px', width:'350px', textAlign:'center'}}>
            <h3 style={{color: '#333'}}>Yeni Etkinlik</h3>

            <input
              className="auth-input"
              style={{width:'90%', marginBottom:'15px'}}
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title:e.target.value})}
              placeholder="Başlık girin..."
              autoFocus
            />

            {/* KATEGORİ SEÇİM KUTUSU */}
            <div style={{marginBottom: '20px', textAlign: 'left'}}>
              <label style={{fontSize:'0.9rem', color:'#666', display:'block', marginBottom:'5px'}}>Kategori Seçiniz:</label>
              <select
                className="auth-input"
                style={{width: '100%', padding: '10px', cursor: 'pointer'}}
                value={newEvent.category}
                onChange={(e) => {
                  const selectedCat = categories.find(c => c.id === e.target.value);
                  if (!selectedCat) return;
                  setNewEvent({
                    ...newEvent,
                    category: selectedCat.id,
                    color: selectedCat.color // Kategori seçilince rengi otomatik ayarla
                  });
                }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button onClick={() => setShowModal(false)} style={{padding:'10px', marginRight:'10px', cursor:'pointer', border:'none', background:'#ddd', borderRadius:'5px'}}>İptal</button>
              <button onClick={handleSave} className="auth-btn" style={{width:'auto', padding:'10px 20px', backgroundColor: newEvent.color}}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
