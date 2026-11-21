import { addManualDispatch, markAsCompleted, deletePickup } from '../actions';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const getAdminClient = () => createClient(supabaseUrl, serviceRoleKey);

// 4. MAIN DASHBOARD COMPONENT
export default async function AdminDashboard() {
  noStore();
  // Fetch live pickups
  const { data: pickups } = await getAdminClient()
    .from('pickups')
    .select('*')
    .order('scheduled_date', { ascending: false });

  // Calculate live metrics
  const safePickups = pickups || [];
  const totalBookings = safePickups.length;
  const packageDeals = safePickups.filter(p => p.client_type === 'Partnership').length;
  const completedRoutes = safePickups.filter(p => p.status?.toLowerCase() === 'completed').length;
  const pendingRoutes = totalBookings - completedRoutes;

  // Fetch REAL live metrics from your new table
  const { data: metrics } = await getAdminClient()
    .from('dashboard_metrics')
    .select('*')
    .single(); // .single() gets the one row we just created

  // Map the real data to the cards (fallback to 0 if empty)
  const kpiData = [
    { label: 'WhatsApp Bookings', value: metrics?.whatsapp_bookings || 0 },
    { label: 'Package Deals', value: metrics?.package_deals || 0 },
    { label: 'Daily Waste (kg)', value: metrics?.daily_waste_kg || 0 },
    { label: 'Youth Supported', value: metrics?.youth_supported || 0 }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-4xl font-bold text-[#1A4D2E]">Rekobo Admin</h1>
          <p className="mt-2 text-gray-600">Live Dispatch & Routing Control</p>
        </header>

        {/* --- REAL LIVE METRICS DASHBOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Total Bookings</h3>
            <p className="text-3xl font-bold text-[#1A4D2E]">{totalBookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Package Deals</h3>
            <p className="text-3xl font-bold text-[#1A4D2E]">{packageDeals}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Completed Routes</h3>
            <p className="text-3xl font-bold text-[#1A4D2E]">{completedRoutes}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Pending Pickups</h3>
            <p className="text-3xl font-bold text-[#1A4D2E]">{pendingRoutes}</p>
          </div>
        </div>

        {/* --- ADD PICKUP FORM --- */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-[#1A4D2E] mb-4">Dispatch New Route</h2>
        <form action={addManualDispatch} className="flex gap-4 items-end">
          
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Customer / Organization Name</label>
            <input 
              type="text" 
              name="customer_name" 
              placeholder="e.g. Phone Order - Mr. Bassey" 
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-[#1A4D2E]" 
              required 
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Scheduled Date</label>
            <input 
              type="date" 
              name="scheduled_date" 
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-[#1A4D2E]" 
              required 
            />
          </div>

          <button type="submit" className="bg-[#1A4D2E] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#133821] transition-colors">
            Add Pickup
          </button>
        </form>
      </div>

        {/* --- ACTIVE PICKUPS TABLE --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Active Pickups</h2>
            <span className="bg-[#1A4D2E]/10 text-[#1A4D2E] text-xs font-semibold px-3 py-1 rounded-full">
              {pickups?.length || 0} Total
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              {/* 1. Update Table Headers */}
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer / Org</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                {/* 2. Update Table Body Row */}
                <tbody className="divide-y divide-gray-200">
                  {safePickups.map((pickup: any) => (
                    <tr key={pickup.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-bold text-gray-900">{pickup.reference_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        <div className="font-medium">{pickup.customer_name || 'N/A'}</div>
                        {pickup.organization_name && (
                          <div className="text-xs text-gray-500">{pickup.organization_name}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pickup.client_type === 'Partnership' 
                            ? 'bg-purple-100 text-purple-800' 
                            : pickup.client_type === 'Offline Booking'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {pickup.client_type || 'Individual'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{pickup.scheduled_date || 'Pending'}</td>
                      
                      {/* 1. Dynamic Status Badge */}
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          pickup.status?.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pickup.status || 'Pending'}
                        </span>
                      </td>
                      
                      {/* 2. Conditional Action Buttons */}
                      <td className="py-3 px-4 text-sm text-right">
                        <div className="flex justify-end space-x-2">
                          {pickup.status?.toLowerCase() !== 'completed' ? (
                            <form action={markAsCompleted}>
                              <input type="hidden" name="id" value={pickup.id} />
                              <button type="submit" className="text-emerald-700 hover:text-emerald-900 border border-emerald-300 rounded px-2.5 py-1 text-xs font-medium bg-white cursor-pointer">
                                Complete
                              </button>
                            </form>
                          ) : (
                            <span className="text-gray-400 text-xs font-medium px-2 py-1">Done</span>
                          )}
                          <form action={deletePickup}>
                            <input type="hidden" name="id" value={pickup.id} />
                            <button type="submit" className="text-red-600 hover:text-red-800 border border-red-200 rounded px-2.5 py-1 text-xs font-medium bg-white cursor-pointer">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}