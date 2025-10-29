# Thread of Clues

**A collaborative mystery-solving game built for Reddit communities.**  
Players work together across multiple posts to uncover hidden words, decode connections, and ultimately solve the grand mystery.

---

## Overview

**Thread of Clues** turns Reddit into a citywide investigation.   
There are multiple *locationn* (e.g. Vienna, London), where players discover clues by inspecting objects, sharing discoveries, and piecing together “fragment codes”.  
When all fragment clues are found, users can combine them to uncover each **location code**, which leads to the **main mystery solution**.

This game thrives on *community collaboration* - players must discuss, share hints, and work together to progress.

---

## Gameplay Flow

1. **Enter a Mystery City:** Choose a location (e.g. Vienna Heist).
2. **Explore Rooms:** Each room contains objects with hidden clues.
3. **Find the Fragment Word:** Select three related clues to form a fragment word.
4. **Collaborate on Reddit:** Share fragments in r/ThreadOfClues to discover the location code.
5. **Solve the Big Mystery:** Combine all location codes to find the final answer.

---

## Built For Reddit

- Designed for **community play** - progress is made through collaboration on Reddit threads.
- Built with **Devvit Web**, ensuring full compatibility with Reddit’s interactive post system.
- Uses **Redis** to handle shared state, track progress, and record player discoveries across rooms.

---

## Key Features

- **Asynchronous Multiplayer:** Each player contributes clues; the full puzzle emerges from community cooperation.
- **Dynamic Instructions:** Guidance changes based on progress - e.g. when fragment or location codes are solved.
- **State Tracking:** Player progress and completion status stored efficiently via Redis.
- **Sleek, Themed UI:** Includes a custom splash screen and polished design for immersive play.

---

## Tech Stack

- **Frontend:** Devvit Web (React + TypeScript)
- **Backend:** Redis for game state management
- **Styling:** Tailwind CSS
- **Data Management:** Type-safe schema for locations, rooms, and mysteries
- **Collaboration Layer:** Reddit threads as the social hub for clue sharing

---

## Demo & Links

- [App Listing](https://developers.reddit.com/apps/threadofclues)
- [Demo Post](https://www.reddit.com/r/ThreadOfClues/comments/1ojask4/thread_of_clues_first_2_cities)
- [Demo Video](https://youtu.be/8Hfp98ELtns)
- [Source Code](https://github.com/VulcanWM/threadofclues)

---

> “Alone, you find fragments. Together, you solve the mystery.”
