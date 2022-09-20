import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { supabase } from "../../utils/supabaseClient";

import nookies from 'nookies'

export default async function logoutUser(req: NextApiRequest, res: NextApiResponse, ctx: NextPageContext) {
    let { error } = await supabase.auth.signOut();

    if (!error) nookies.destroy(ctx, 'USER_LOGGED_ARMAZEM', { path: '/' })

    if (error) return res.status(401).json({ error: error.message });

    return res.status(200).json({ logout: true });
}