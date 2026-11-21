'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitWebsiteForm(formData: FormData) {
  const customerName = formData.get('name') as string || formData.get('customer_name') as string || "N/A";
  const customerPhone = formData.get('phone') as string || formData.get('whatsapp') as string || "N/A";
  const address = formData.get('address') as string || "N/A";
  const scheduledDate = formData.get('scheduled_date') as string || new Date().toISOString().split('T')[0];
  const wasteType = formData.get('waste_type') as string || "N/A";

  const { data: newPickup, error } = await supabase
    .from('pickups')
    .insert([{ 
        scheduled_date: scheduledDate, 
        status: 'pending',
        customer_name: customerName, 
        client_type: 'Individual'
    }])
    .select('id, seq_id') 
    .single();

  if (error) throw new Error('Database insertion failed');

  const orderNumber = `REK-${String(newPickup.seq_id).padStart(3, '0')}`;

  await supabase
    .from('pickups')
    .update({ reference_number: orderNumber })
    .eq('id', newPickup.id);

  const makeWebhookUrl = "https://hook.eu1.make.com/dvgimt7fobsl7hbg5onfkqu316yzrfbi"; 
  
  await fetch(makeWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderNumber: orderNumber,
      organization: customerName,
      type: "Pickup / Service Booking",
      contactPerson: customerName,
      phone: customerPhone,
      email: "N/A",
      estimated_volume: wasteType,
      address: address
    })
  }).catch(err => console.error("Make.com error:", err));

  return { success: true, "Reference Number": orderNumber };
}

export async function submitPartnershipForm(formData: FormData) {
  const organizationName = formData.get('organization') as string || formData.get('organization_name') as string || "N/A";
  const contactPerson = formData.get('contactPerson') as string || formData.get('contact_person') as string || "N/A";
  const phone = formData.get('phone') as string || "N/A";
  const email = formData.get('email') as string || "N/A";
  const orgType = formData.get('type') as string || formData.get('organization_type') as string || "N/A";
  const volume = formData.get('estimated_volume') as string || formData.get('volume') as string || "N/A";
  const address = formData.get('address') as string || "N/A";

  const { data: newPickup, error } = await supabase
    .from('pickups')
    .insert([{ 
        status: 'pending',
        customer_name: contactPerson, 
        organization_name: organizationName,
        email: email,
        client_type: 'Partnership'
    }])
    .select('id, seq_id') 
    .single();

  if (error) throw new Error('Database insertion failed');

  const orderNumber = `REK-${String(newPickup.seq_id).padStart(3, '0')}`;

  await supabase
    .from('pickups')
    .update({ reference_number: orderNumber })
    .eq('id', newPickup.id);

  const makeWebhookUrl = "https://hook.eu1.make.com/dvgimt7fobsl7hbg5onfkqu316yzrfbi"; 

  await fetch(makeWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderNumber: orderNumber,
      organization: organizationName,
      type: orgType,
      contactPerson: contactPerson,
      phone: phone,
      email: email,
      estimated_volume: volume,
      address: address
    })
  }).catch(err => console.error("Make.com error:", err));

  return { success: true, "Reference Number": orderNumber };
}

export async function addManualDispatch(formData: FormData) {
  const scheduledDate = formData.get('scheduled_date');
  const customerName = formData.get('customer_name') || 'Offline Booking';

  const { data: newPickup, error } = await supabase
    .from('pickups')
    .insert([{ 
        scheduled_date: scheduledDate, 
        status: 'pending',
        customer_name: customerName,
        client_type: 'Offline Booking' 
    }])
    .select('id, seq_id') 
    .single();

  if (error) throw new Error('Database insertion failed');

  const orderNumber = `REK-${String(newPickup.seq_id).padStart(3, '0')}`;

  await supabase
    .from('pickups')
    .update({ reference_number: orderNumber })
    .eq('id', newPickup.id);

  revalidatePath('/admin');
}

export async function markAsCompleted(formData: FormData) {
  const id = formData.get('id');
  await supabase.from('pickups').update({ status: 'completed' }).eq('id', id);
  revalidatePath('/admin');
}

export async function deletePickup(formData: FormData) {
  const id = formData.get('id');
  await supabase.from('pickups').delete().eq('id', id);
  revalidatePath('/admin');
}