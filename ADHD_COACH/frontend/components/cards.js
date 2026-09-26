import { SupabaseClient } from "@supabase/supabase-js";
import { reviewCard } from "./sm2";

//to get decks so that manage.jsx can show what decks are even there to click
export async function getDecks() {
    const {data, error} = await supabase 
        .from("decks")
        .select("*")
            .order("created_at", {ascending:false});
        if (error) throw error;
        return data;
        
}
//to add decks-yeah
export async function addDeck(name) {

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) throw new Error ("Hm. Looks like you are not logged in.")


    const{data, error} = await supabase 
    .from("decks")
    .insert({name, created_by:user.id})
    .select()
    .single();

    if (error) throw error;
    return data;
    

    }
    
}
//to insert new cards into decks
//to get card that already exist from deck
//
