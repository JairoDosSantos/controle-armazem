import { supabase } from "../../utils/supabaseClient";

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function equipamento(req: NextApiRequest, res: NextApiResponse) {

    //const user = await supabase.auth.getUser()
    //const user = window.localStorage.getItem('jairocrissantos@gmail.com')
    const { classificacao_id, descricao, duracao_id, stock_emergencia, especialidade_id } = req.body
    switch (req.method) {

        case 'GET':

            try {

                const { data, error } = await supabase
                    .from('equipamento')
                    .select("id,descricao,classificacao_id(id,tipo),duracao_id(id,tempo),stock_emergencia,especialidade_id(id,especialidade)")

                return res.status(200).json({ data: data });

            } catch (error) {
                return res.status(500).json({ data: error });
            }

        case 'POST':
            try {
                const { data, error } = await supabase
                    .from('equipamento')
                    .insert({ classificacao_id, descricao, duracao_id, stock_emergencia, especialidade_id })
                    .single()

                if (error) return false
                return true

            } catch (error) {
                return (error)
            }
        default:
            return res.status(400).json({ data: 'ERROR. Request not found' });
    }


}