import { SupabaseClient } from "@supabase/supabase-js";
import { reviewCard } from "./sm2";
import { supabase } from "../../supabaseclient";

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


    

//to insert new cards into decks
export async function addCard(deckId, front, back) {
   const{
    data: {user}, 
} = await supabase.auth.getUser();
if (!user) throw new Error("Hm. Looks like you're not logged in")
    
    const{data, error}= await supabase
    .from("cards")
    .insert({deck_id:deckId, front, back, created_by: user.id})
    .select()
    .single();

    if(error) throw error;
    return data;
}








//to get card that already exist from deck
export async function getCardsInDeck(deckId) {
    const{data,error} = await supabase
        .from("cards")
        .select("*")
        .eq("deck_id", deckId)
        .order("created_at", {ascending: true});
    if(error) throw error;
    return data; 
}

