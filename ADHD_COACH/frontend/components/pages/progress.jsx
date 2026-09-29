import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../supabaseclient";

//The tables we use are 
// focus session - user_id, duration_minutes, created_at 
//card_progress: user_id, card_id, interval, next_review, upadated_at
//cards: id, deck_id decks:id, name

const FOCUS_TABLE = "focus_sessions"; 

const MASTERED_INTERVAL_DAYS= 21;
const MONTHLY_GOAL_MINUTES= 600;

const dayKey = (d) => 
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function timeAgo(iso) {
    const mins =Math.floor((Date.now()-new Date(iso).getTime())/60000);
    if(mins<1) return "just now";
    if (mins < 60) return '${mins} mins ago'; 
    const hrs= Math.floor(mins/60);

    if(hrs<24) return `${hrs} hour${hrs>1 ? "s": ""} ago`;
    const days= Math.floor(hrs/24);
    return `${days} day${day>1 ? "s" : "" } ago`;

}


const heat = ["#FFDCDC", "#F5CACA", "#EAB8B8", "#E0AAAA", "#D8A2A2"];
const level = (m) => (m <= 0? 0: m< 30? 1: m<60? 2: m<120? 3: 4);


function Card({ title, right, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[#E6E6EC] bg-white p-5 ${className}`}>
      {(title || right) && (
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#111]">{title}</h2>
          {right && <span className="text-xs font-semibold text-[#7C3AED]">{right}</span>}
        </div>
      )}
      {children}
    </section>
  );
}


