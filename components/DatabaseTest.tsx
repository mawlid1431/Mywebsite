import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../utils/supabase/client';

export default function DatabaseTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test 1: Check if table exists
      const { data: tables, error: tableError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      console.log('Table test:', { tables, tableError });

      // Test 2: Get all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      console.log('Users:', users);

      setResult({
        tableExists: !tableError,
        tableError: tableError?.message,
        usersCount: users?.length || 0,
        users: users?.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          is_active: u.is_active
        })),
        usersError: usersError?.message
      });
    } catch (error: any) {
      console.error('Test error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={loading}>
          {loading ? 'Testing...' : 'Test Database Connection'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
