import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api/api'; // Backend ile konuşan dosyamız
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });

  // Sayfa açılınca randevuları çek
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/appointments');
      // Backend verisini (start_time) FullCalendar formatına (start) çeviriyoruz
      const formattedEvents = res.data.map(item => ({
        id: item.id,
        title: item.title,
        start: item.start_time,
        end: item.end_time
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Randevular çekilemedi:", err);
    }
  };

  // Takvimde boş bir yere tıklayınca çalışır
  const handleDateSelect = (selectInfo) => {
    setNewEvent({ 
      title: '', 
      start: selectInfo.startStr, 
      end: selectInfo.endStr 
    });
    setShowModal(true);
  };

  // Randevuyu kaydet
  const handleSave = async () => {
    if (!newEvent.title) return alert('Lütfen bir başlık girin');

    try {
      await api.post('/appointments', {
        title: newEvent.title,
        start_time: newEvent.start,
        end_time: newEvent.end,
        description: "React üzerinden eklendi"
      });
      setShowModal(false);
      fetchEvents(); // Listeyi güncelle
    } catch (err) {
      alert('Kaydedilemedi');
    }
  };

  const handleEventClick = async (clickInfo) => {
    if (window.confirm(`'${clickInfo.event.title}' silinsin mi?`)) {
      try {
        await api.delete(`/appointments/${clickInfo.event.id}`);
        clickInfo.event.remove(); 
      } catch (err) {
        alert('Silinemedi');
      }
    }
  };

const handleEventDrop = async (info) => {
  try {
    await api.put(`/appointments/${info.event.id}`, {
      start_time: info.event.startStr,
      end_time: info.event.endStr
    });
  } catch (err) {
    alert('Güncelleme başarısız, eski yerine dönülüyor.');
    info.revert(); 
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Hoşgeldin, {user?.fullName || 'Kullanıcı'}</h2>
        <button onClick={logout} style={{ background: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>Çıkış Yap</button>
      </div>

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
        eventClick={handleEventClick}
        height="auto"
        eventDrop={handleEventDrop} 
        eventResize={handleEventDrop}
      />

      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <h3>Yeni Randevu</h3>
            <input 
              type="text" 
              placeholder="Randevu Başlığı" 
              value={newEvent.title} 
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)}>İptal</button>
              <button onClick={handleSave} style={{ background: 'green', color: 'white' }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Basit CSS Stilleri (Dosya kalabalığı olmasın diye buraya yazdım)
const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  content: {
    background: 'white', padding: '20px', borderRadius: '8px', width: '300px'
  }
};

export default Dashboard;