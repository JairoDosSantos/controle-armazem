import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

import nookies from 'nookies'

export default async function logoutUser(req: NextApiRequest, res: NextApiResponse) {
    let { error } = await supabase.auth.signOut();

    if (!error) nookies.destroy({ res }, 'USER_LOGGED_ARMAZEM')

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json({ body: "Sessão terminada com sucesso" });
}