import { supabase } from "../../utils/supabaseClient";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function getUser(req: NextApiRequest, res: NextApiResponse) {

    const user = await supabase.auth.getUser()
    // const user = window.localStorage.getItem('jairocrissantos@gmail.com')

    return res.status(200).json({ user: user });

}