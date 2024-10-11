import { TablesInsert } from '@/database.types';
import { supabase } from '@/lib/supabase';
import { useMutation } from '@tanstack/react-query';

export const useInsertOrderItems = () => {
  return useMutation({
    mutationFn: async (
      items: Array<Omit<TablesInsert<'order_items'>, 'user_id'>>
    ) => {
      const { error, data } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
