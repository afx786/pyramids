import{a as e}from"./index-D_V5-8_8.js";const r={listTeams(){return e.get("/teams")},listHackathons(){return e.get("/hackathons")},getFeed(t="all"){return e.get(`/feed?type=${t}`)}};export{r as d};
