import { supabase } from "../../utils/supabaseClient";
import nookies from 'nookies'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function registerUser(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;


    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });


    if (data.user) {

        nookies.set({ res }, 'USER_LOGGED_ARMAZEM', JSON.stringify(data.user), {
            maxAge: 86400,
            path: '/',
        })
    }

    //window.localStorage.setItem(email, JSON.stringify(session));

    /**
     * supabase.auth.api.setAuthCookie(req, res)
         *  const getCookie = supabase.auth.api.getUserByCookie(req)
          * console.log(getCookie)
     */

    if (error) {
        return res.status(401).json({ error: error.message });
    } else {
        return res.status(200).json({ user: data.user });
    }

}