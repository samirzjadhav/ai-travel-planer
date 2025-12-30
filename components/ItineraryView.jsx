'use client'
import { useState } from 'react'
import DayCard from './DayCard'
import MapView from './MapView'
import { saveItineraryToLocal } from '../utils/localStorage'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export default function ItineraryView({ data }) {
  const [saving, setSaving] = useState(false)

  if (!data) return null

  const title = data.destination ? `Trip to ${data.destination}` : 'Your Trip'

  async function handleSave() {
    setSaving(true)
    try {
      const id = saveItineraryToLocal({
        id: `it-${Date.now()}`,
        title,
        destination: data.destination,
        days: data.days || (data.itinerary?.length || 0),
        costEstimate: data.total_cost_estimate,
        itinerary: data
      })
      // navigate to saved page or show notice
      alert('Saved! ID: ' + id)
    } finally {
      setSaving(false)
    }
  }

  async function exportPdf() {
    // simple export: snapshot the itinerary DOM
    const element = document.getElementById('itinerary-root')
    if (!element) return
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('itinerary.pdf')
  }

  return (
    <section id="itinerary-root" className="mt-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-slate-600">{data.overview}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} className="px-3 py-1 border rounded">{saving ? 'Saving...' : 'Save'}</button>
          <button onClick={exportPdf} className="px-3 py-1 border rounded">Export PDF</button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          {Array.isArray(data.itinerary) ? data.itinerary.map((d, i) => (
            <DayCard key={i} day={d} />
          )) : <div>No itinerary available</div>}
        </div>

        <div>
          <MapView itinerary={data.itinerary || []} />
        </div>
      </div>
    </section>
  )
}
