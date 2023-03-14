
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function Especialidade(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {

        case 'GET':
            try {

                const { data, error } = await supabase
                    .from('especialidade')
                    .select("*")
                    .order('id', { ascending: true })
                if (error) return res.status(400).json({ error })
                return res.status(200).json({ data });

            } catch (error) {
                return res.status(500).json({ data: error });
            }

        default:
            return res.status(400).json({ data: 'REQUEST NOT FOUND.' });
    }

}