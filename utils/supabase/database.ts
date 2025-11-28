import { supabase, Service, Project } from './client';

// Orders types
export interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_street?: string;
  address_city?: string;
  address_postal?: string;
  address_country?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

// Contacts types
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at?: string;
}

// Services Management Functions
export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getServices:', err);
    return [];
  }
}

export async function addService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) {
      console.error('Error adding service:', error);
      return null;
    }

    console.log('✅ Service added successfully!');
    return data;
  } catch (err) {
    console.error('Error in addService:', err);
    return null;
  }
}

export async function updateService(id: number, service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return null;
    }

    console.log('✅ Service updated successfully!');
    return data;
  } catch (err) {
    console.error('Error in updateService:', err);
    return null;
  }
}

export async function deleteService(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      return false;
    }

    console.log('✅ Service deleted successfully!');
    return true;
  } catch (err) {
    console.error('Error in deleteService:', err);
    return false;
  }
}

// Projects Management Functions  
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getProjects:', err);
    return [];
  }
}

export async function addProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error('Error adding project:', error);
      return null;
    }

    console.log('✅ Project added successfully!');
    return data;
  } catch (err) {
    console.error('Error in addProject:', err);
    return null;
  }
}

export async function updateProject(id: number, project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return null;
    }

    console.log('✅ Project updated successfully!');
    return data;
  } catch (err) {
    console.error('Error in updateProject:', err);
    return null;
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    console.log('✅ Project deleted successfully!');
    return true;
  } catch (err) {
    console.error('Error in deleteProject:', err);
    return false;
  }
}

// Utility Functions
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Test services table
    const { error: servicesError } = await supabase
      .from('services')
      .select('count', { count: 'exact' });

    // Test projects table
    const { error: projectsError } = await supabase
      .from('projects')
      .select('count', { count: 'exact' });

    // Test orders table
    const { error: ordersError } = await supabase
      .from('orders')
      .select('count', { count: 'exact' });

    if (servicesError || projectsError || ordersError) {
      console.error('Database connection test failed:', {
        servicesError,
        projectsError,
        ordersError
      });
      return false;
    }

    console.log('✅ Database connection test successful!');
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
}

// Real-time subscriptions (optional - for live updates)
export function subscribeToServices(callback: (services: Service[]) => void) {
  return supabase
    .channel('services-changes')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'services'
      },
      async () => {
        const services = await getServices();
        callback(services);
      }
    )
    .subscribe();
}

export function subscribeToProjects(callback: (projects: Project[]) => void) {
  return supabase
    .channel('projects-changes')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects'
      },
      async () => {
        const projects = await getProjects();
        callback(projects);
      }
    )
    .subscribe();
}

// Orders Management Functions
export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getOrders:', err);
    return [];
  }
}

export async function addOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error adding order:', error);
      return null;
    }

    console.log('✅ Order added successfully!');
    return data;
  } catch (err) {
    console.error('Error in addOrder:', err);
    return null;
  }
}

export async function updateOrderStatus(id: number, status: Order['status']): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }

    console.log('✅ Order status updated successfully!');
    return data;
  } catch (err) {
    console.error('Error in updateOrderStatus:', err);
    return null;
  }
}

export async function deleteOrder(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }

    console.log('✅ Order deleted successfully!');
    return true;
  } catch (err) {
    console.error('Error in deleteOrder:', err);
    return false;
  }
}

// Contacts Management Functions
export async function getContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getContacts:', err);
    return [];
  }
}

export async function addContact(contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact | null> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Error adding contact:', error);
      return null;
    }

    console.log('✅ Contact added successfully!');
    return data;
  } catch (err) {
    console.error('Error in addContact:', err);
    return null;
  }
}

export async function updateContactStatus(id: number, status: Contact['status']): Promise<Contact | null> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact status:', error);
      return null;
    }

    console.log('✅ Contact status updated successfully!');
    return data;
  } catch (err) {
    console.error('Error in updateContactStatus:', err);
    return null;
  }
}

export async function deleteContact(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
      return false;
    }

    console.log('✅ Contact deleted successfully!');
    return true;
  } catch (err) {
    console.error('Error in deleteContact:', err);
    return false;
  }
}

// User Management Types
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  password: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  password_changed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface PasswordHistory {
  id: number;
  user_id: number;
  password_hash: string;
  created_at: string;
}

// User Management Functions
export async function getUserByUsername(usernameOrEmail: string): Promise<User | null> {
  try {
    console.log('Looking for user:', usernameOrEmail);

    // Try to find user by username first
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', usernameOrEmail)
      .maybeSingle();

    console.log('Username search result:', { data, error });

    // If not found by username, try email
    if (!data && !error) {
      console.log('Trying email search...');
      const result = await supabase
        .from('users')
        .select('*')
        .eq('email', usernameOrEmail)
        .maybeSingle();

      console.log('Email search result:', { data: result.data, error: result.error });

      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Final user data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        password: newPassword,
        password_changed_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}

export async function addPasswordToHistory(userId: number, passwordHash: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('password_history')
      .insert({ user_id: userId, password_hash: passwordHash });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding password to history:', error);
    return false;
  }
}

export async function getPasswordHistory(userId: number, limit: number = 5): Promise<PasswordHistory[]> {
  try {
    const { data, error } = await supabase
      .from('password_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching password history:', error);
    return [];
  }
}

export async function updateLastLogin(userId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating last login:', error);
    return false;
  }
}

export async function createUser(userData: {
  username: string;
  email: string;
  name: string;
  password: string;
  role?: string;
}): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: userData.username,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: userData.role || 'admin'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
