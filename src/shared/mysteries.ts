type MysteriesType = {
  [key: string]: {
    mystery_name: string
    main_answer: string
    title: string
    desc: string
    locations: {
      name: string
      emoji: string
      location_code: string
      fragment_codes: string[]
      objects: {
        id: number
        real: boolean
        name: string
        emoji: string
        messages: string[]
      }[]
    }[]
  }
}

export const mysteries: MysteriesType = {
  "vienna": {
    "mystery_name": "Vienna Heist",
    "main_answer": "TRUMP",
    "title": '🎭 Vienna Heist',
    "desc": 'Unravel the elegant criminal ring behind the royal jewel theft.',
    "locations": [
      {
        "name": "Palace",
        "emoji": "🏰",
        "location_code": "ORDER",
        "fragment_codes": ["RULE", "LAW", "RANK"],
        "objects": [
          // REAL OBJECTS (Clues for RULE, LAW, RANK)
          {"id": 51, "real": true, "name": "Imperial Scepter", "emoji": "⚕️", "messages": ["A principle that governs.", "A formal decree written by Parliament.", "The position on the ladder of success."]},
          {"id": 52, "real": true, "name": "Formal Treaty", "emoji": "📜", "messages": ["What a King enforces.", "A judicial code.", "A high station in a hierarchy."]},
          {"id": 53, "real": true, "name": "Guard's Manifesto", "emoji": "📝", "messages": ["A command given to a unit.", "A governing ordinance.", "A level of status or authority."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 54, "real": false, "name": "Gilt Throne", "emoji": "🪑", "messages": ["Made of heavy, rigid wood. (Case)", "A formal agreement.", "A chair that takes up space."]},
          {"id": 55, "real": false, "name": "Tapestry of a Battle", "emoji": "🖼️", "messages": ["A large scene of conflict.", "Woven thread covering the wall. (Gown)", "A small metallic thread. (Screw)"]},
          {"id": 56, "real": false, "name": "Ceremonial Sword", "emoji": "🗡️", "messages": ["A long blade of polished steel. (Long)", "Used to divide foes. (Cut)", "The sound of a secret being whispered. (Air)"]},
          {"id": 57, "real": false, "name": "Marble Bust of an Emperor", "emoji": "🗿", "messages": ["Used to look far away. (Long)", "A polished stone. (Gem)", "The top of the body. (Cap)"]},
          {"id": 58, "real": false, "name": "Window with High Latch", "emoji": "🪟", "messages": ["A pane of clear glass.", "A small, circular knob. (Ring)", "Secured with a tight cable. (Tie)"]},
          {"id": 59, "real": false, "name": "Royal Candelabra", "emoji": "🕯️", "messages": ["A twist of gold metal. (Screw)", "A small flame burns brightly.", "Needs still air to burn. (Air)"]},
          {"id": 60, "real": false, "name": "Grand Ballroom Map", "emoji": "🗺️", "messages": ["A paper with many paths.", "A circle drawn on a floorplan. (Seal)", "A long extension of space. (Long)"]}
        ]
      },
      {
        "name": "Opera House",
        "emoji": "🎙️",
        "location_code": "SEAL",
        "fragment_codes": ["WAX", "STAMP", "PRESS"],
        "objects": [
          // REAL OBJECTS (Clues for WAX, STAMP, PRESS)
          {"id": 61, "real": true, "name": "Box Office Ledger", "emoji": "🎟️", "messages": ["Used to create a rigid closure.", "An official mark of payment.", "To use great force on an object."]},
          {"id": 62, "real": true, "name": "Velvet Curtain", "emoji": "🎭", "messages": ["A medium for formal authentication.", "An indelible mark.", "To apply strong influence."]},
          {"id": 63, "real": true, "name": "Composer's Desk", "emoji": "🎹", "messages": ["A substance used to protect food.", "An impression left on soft ground.", "The motion of a printing machine."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 64, "real": false, "name": "Orchestra Pit Railing", "emoji": "🚧", "messages": ["A long piece of bent metal. (Long)", "A circular barrier.", "The lowest point of the stage. (Bottom)"]},
          {"id": 65, "real": false, "name": "Binoculars", "emoji": "🔭", "messages": ["Used to see small details. (Mark)", "Made of two metal tubes. (Tube)", "A tight grip is needed. (Tight)"]},
          {"id": 66, "real": false, "name": "Singer's Costume", "emoji": "👗", "messages": ["A garment of soft cloth. (Gown)", "Requires a needle and thread.", "A very high note. (Cap)"]},
          {"id": 67, "real": false, "name": "Antique Microphone", "emoji": "🎙️", "messages": ["A metallic cylinder. (Tube)", "Used for communication. (Sign)", "Held by a strong cable. (Tie)"]},
          {"id": 68, "real": false, "name": "Stage Trapdoor", "emoji": "🚪", "messages": ["A hidden exit.", "A wooden enclosure. (Box)", "The force of a foot pushing down. (Press)"]},
          {"id": 69, "real": false, "name": "Velvet Rope", "emoji": "🔗", "messages": ["Used to command the flow of people. (Order)", "A complex knot of threads.", "A flexible line. (Line)"]},
          {"id": 70, "real": false, "name": "Audience Chair", "emoji": "🪑", "messages": ["A place to rest. (Rest)", "Secured with a bolt. (Nut)", "A rectangular frame."]}
        ]
      },
      {
        "name": "Cathedral",
        "emoji": "⛪",
        "location_code": "CAP",
        "fragment_codes": ["TOP", "LID", "END"],
        "objects": [
          // REAL OBJECTS (Clues for TOP, LID, END)
          {"id": 71, "real": true, "name": "Highest Spire", "emoji": "⛪", "messages": ["The extreme upper portion.", "A covering for a container.", "The finish line or terminus."]},
          {"id": 72, "real": true, "name": "Altar Censer", "emoji": "🏺", "messages": ["The summit of a mountain.", "A piece that screws shut.", "The conclusion of a long journey."]},
          {"id": 73, "real": true, "name": "Bishop's Mitre", "emoji": "👑", "messages": ["The crown of a hat.", "A removable cover.", "The final position in a rank."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 74, "real": false, "name": "Organ Console", "emoji": "🎶", "messages": ["A large wooden box. (Box)", "Used to play music.", "A continuous stream of sound. (Flow)"]},
          {"id": 75, "real": false, "name": "Stained Glass Window", "emoji": "💠", "messages": ["A circular frame. (Ring)", "A colorful mark on the wall. (Mark)", "Secured with tight lead. (Tie)"]},
          {"id": 76, "real": false, "name": "Prayer Kneeler", "emoji": "🙏", "messages": ["Used for long reflection. (Long)", "A small, soft pillow. (Pillow)", "The motion of a bow. (Flow)"]},
          {"id": 77, "real": false, "name": "Holy Water Font", "emoji": "💧", "messages": ["A circular basin.", "A heavy stone bowl. (Gem)", "A governing ordinance. (Law)"]},
          {"id": 78, "real": false, "name": "Clergy Robe", "emoji": "🧥", "messages": ["A flowing piece of cloth. (Gown)", "Made of velvet and silk. (Skin)", "A line of stitching."]},
          {"id": 79, "real": false, "name": "Candles on an Altar", "emoji": "🕯️", "messages": ["A long, cylindrical shape. (Tube)", "A small flame burns brightly.", "A place to rest your thoughts. (Head)"]},
          {"id": 80, "real": false, "name": "Bronze Plaque", "emoji": "🥉", "messages": ["A formal indication of approval. (Sign)", "An impression left on the surface.", "A permanent fixture. (Seal)"]}
        ]
      },
      {
        "name": "Coffee House",
        "emoji": "☕",
        "location_code": "GOWN",
        "fragment_codes": ["ROBE", "CLOTH", "DRESS"],
        "objects": [
          // REAL OBJECTS (Clues for ROBE, CLOTH, DRESS)
          {"id": 81, "real": true, "name": "Waiter's Formal Apron", "emoji": "🥼", "messages": ["A loose, flowing outer garment.", "A woven material.", "To attire oneself for an event."]},
          {"id": 82, "real": true, "name": "Heavy Drapery", "emoji": "🧣", "messages": ["Ceremonial or formal attire.", "Fabric used for tailoring.", "A covering for the body."]},
          {"id": 83, "real": true, "name": "Coat Rack with a Trench Coat", "emoji": "🧥", "messages": ["A long piece of flowing material.", "A soft, flexible substance.", "A finished set of clothes."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 84, "real": false, "name": "Espresso Machine", "emoji": "☕", "messages": ["To apply strong influence. (Press)", "A metallic vessel. (Case)", "Requires a tight seal. (Seal)"]},
          {"id": 85, "real": false, "name": "Small Table", "emoji": "🍽️", "messages": ["A wooden circle. (Ring)", "A place to sit and rest. (Rest)", "A sturdy, lockable enclosure. (Box)"]},
          {"id": 86, "real": false, "name": "Chess Board", "emoji": "♟️", "messages": ["Used to enforce a rule. (Rule)", "A permanent mark on the table. (Mark)", "A series of turns and moves. (Flow)"]},
          {"id": 87, "real": false, "name": "Sugar Tongs", "emoji": "🥄", "messages": ["A small metallic pin. (Screw)", "A piece of bent wire.", "A final binding. (Tie)"]},
          {"id": 88, "real": false, "name": "Newspaper Stack", "emoji": "📰", "messages": ["A long sequence of words. (Line)", "A paper covering. (Skin)", "The absolute final page. (End)"]},
          {"id": 89, "real": false, "name": "Waiter's Notebook", "emoji": "📓", "messages": ["A gesture used for communication. (Sign)", "A soft covering for the paper. (Skin)", "A long column of numbers. (Line)"]},
          {"id": 90, "real": false, "name": "Spoon on a Saucer", "emoji": "🍵", "messages": ["Used for easy, friction-less movement. (Slide)", "A small, shallow container.", "A circular motion for mixing."]}
        ]
      },
      {
        "name": "Crypt",
        "emoji": "⚰️",
        "location_code": "TIE",
        "fragment_codes": ["FAST", "KNOT", "CABLE"],
        "objects": [
          // REAL OBJECTS (Clues for FAST, KNOT, CABLE)
          {"id": 91, "real": true, "name": "Iron-Banded Coffin", "emoji": "⚰️", "messages": ["Held rigidly in place.", "A loop used for securing.", "A thick piece of wire or rope."]},
          {"id": 92, "real": true, "name": "Heavy Chain", "emoji": "⛓️", "messages": ["To secure something quickly.", "A complex loop.", "A line of linked metal."]},
          {"id": 93, "real": true, "name": "Sealed Stone Tablet", "emoji": "🪨", "messages": ["Not loose or sloppy.", "A binding for ropes.", "A thick, strong wire."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 94, "real": false, "name": "Dusty Ceremonial Boots", "emoji": "👢", "messages": ["Made of dried leather. (Skin)", "Used for walking or running.", "A final piece of attire. (Dress)"]},
          {"id": 95, "real": false, "name": "Tattered Banner", "emoji": "🚩", "messages": ["A long piece of cloth. (Gown)", "A visual indication of allegiance. (Sign)", "The highest point of a pole. (Top)"]},
          {"id": 96, "real": false, "name": "Old Prayer Book", "emoji": "📖", "messages": ["A written command. (Order)", "A paper covering. (Lid)", "A sequence of words written out. (Line)"]},
          {"id": 97, "real": false, "name": "Grave Marker", "emoji": "🪦", "messages": ["A blemish or spot on the ground. (Mark)", "The very last resting place. (End)", "A piece of polished stone. (Gem)"]},
          {"id": 98, "real": false, "name": "Sexton's Shovel", "emoji": "🥄", "messages": ["Used for digging underground. (Shaft)", "Made of bent metal.", "The terminus of the handle. (End)"]},
          {"id": 99, "real": false, "name": "Wooden Crucifix", "emoji": "✝️", "messages": ["A symbol of high rank. (Rank)", "Secured with a small pin. (Screw)", "A long wooden object."]},
          {"id": 100, "real": false, "name": "Altar Cloth", "emoji": "🤍", "messages": ["A soft, woven material. (Cloth)", "A piece that screws shut. (Nut)", "A simple paper container. (Box)"]}
        ]
      }
    ]
  },
  "london": {
    "mystery_name": "London Heist",
    "main_answer": "ELON",
    "title": '🕵️ London Theft',
    "desc": 'Solve the daring museum robbery that shocked the city.',
    "locations": [
      {
        "name": "Museum",
        "emoji": "🏛️",
        "location_code": "BEARING",
        "fragment_codes": ["GEM", "RING", "AIR"],
        "objects": [
          // REAL OBJECTS (Clues for GEM, RING, AIR)
          {"id": 1, "real": true, "name": "Scepter of James I", "emoji": "👑", "messages": ["A stone a jeweler polishes.", "A golden circle for a hand.", "It's the breath of a king's speech."]},
          {"id": 2, "real": true, "name": "Hope Diamond Replica", "emoji": "💎", "messages": ["A highly valued mineral.", "A symbol of commitment, endless.", "Pneumatic pressure is its friend."]},
          {"id": 3, "real": true, "name": "Rosetta Stone", "emoji": "🪨", "messages": ["A foundational rock.", "It encircles the hieroglyphs.", "You can feel it, but you can't see it."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 4, "real": false, "name": "A Roman Coin", "emoji": "🪙", "messages": ["A unit of currency from a vault. (Bank)", "Has a large, round diameter.", "Used to buy passage on the ferry. (Docks)"]},
          {"id": 5, "real": false, "name": "Broken Clock Gear", "emoji": "⚙️", "messages": ["A piece that locks the movement. (Lock)", "It's what a satellite orbits.", "The empty space between notes."]},
          {"id": 6, "real": false, "name": "Model of a Submarine", "emoji": "🚢", "messages": ["Made of thick metal and rivets. (Nut)", "A continuous vessel for travel.", "Requires ballast for diving. (Docks)"]},
          {"id": 7, "real": false, "name": "Guard's Whistle", "emoji": "📢", "messages": ["A loud noise to summon help.", "A circular device, you blow through it.", "Used to signal danger in the dark. (Underground)"]},
          {"id": 8, "real": false, "name": "Leather Gauntlet", "emoji": "🧤", "messages": ["Secures the wrist tightly. (Tight)", "A covering for the hand. (Case)", "The opposite of solid ground."]},
          {"id": 9, "real": false, "name": "Old Map of Westminster", "emoji": "🗺️", "messages": ["A drawing of the city streets. (Long)", "Follow the circular tube line. (Ring)", "A paper with many paths."]},
          {"id": 10, "real": false, "name": "Key on a Lanyard", "emoji": "🗝️", "messages": ["A token of access. (Lock)", "Opens a secret door with a twist. (Screw)", "Flies like a kite on a string."]}
        ]
      },
      {
        "name": "Bank",
        "emoji": "🏦",
        "location_code": "SHAFT",
        "fragment_codes": ["LONG", "TUBE", "SLIDE"],
        "objects": [
          // REAL OBJECTS (Clues for LONG, TUBE, SLIDE)
          {"id": 11, "real": true, "name": "Ledger from 1901", "emoji": "📜", "messages": ["A substantial stretch of time.", "A hollow passage for a mouse.", "The slippery descent into debt."]},
          {"id": 12, "real": true, "name": "Roll of Blueprint Paper", "emoji": "📐", "messages": ["The measurement from start to finish.", "A cylindrical container for plans.", "You do this across ice in winter."]},
          {"id": 13, "real": true, "name": "Shadow of the Vault Door", "emoji": "👤", "messages": ["When drawn out, it covers distance.", "Where the London train runs beneath the street.", "A gentle downward motion."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 14, "real": false, "name": "Banker's Green Visor", "emoji": "🕶️", "messages": ["Worn by one who counts money.", "A circular frame for the head. (Ring)", "Covers the face for protection. (Case)"]},
          {"id": 15, "real": false, "name": "Pneumatic Deposit System", "emoji": "📦", "messages": ["The opposite of quick.", "A vessel for carrying compressed air.", "A hard box to store notes. (Case)"]},
          {"id": 16, "real": false, "name": "Vault Tumbler", "emoji": "🔒", "messages": ["A series of turns to open a safe. (Screw)", "Made of thick, round metal.", "Used for easy, friction-less movement."]},
          {"id": 17, "real": false, "name": "Gold Bar", "emoji": "🪙", "messages": ["More valuable than a diamond. (Gem)", "Heavy, solid, and immovable.", "It is secured with a tight clamp. (Nut)"]},
          {"id": 18, "real": false, "name": "Deposit Slip Tray", "emoji": "🧾", "messages": ["A small paper container. (Box)", "Used to transport money.", "A motion made on a playground. (Slide)"]},
          {"id": 19, "real": false, "name": "Emergency Siren", "emoji": "🚨", "messages": ["A noise that echoes far away.", "A hollow, cylindrical shape.", "A mechanism of security. (Lock)", ]},
          {"id": 20, "real": false, "name": "Lockbox Keypad", "emoji": "🔢", "messages": ["Requires a long sequence of digits. (Long)", "A small, firm button.", "The quickest way out. (Slide)"]}
        ]
      },
      {
        "name": "Underground",
        "emoji": "🚇",
        "location_code": "PILLOW",
        "fragment_codes": ["SLEEP", "REST", "HEAD"],
        "objects": [
          // REAL OBJECTS (Clues for SLEEP, REST, HEAD)
          {"id": 21, "real": true, "name": "Dozing Commuter", "emoji": "😴", "messages": ["The activity after a long day.", "A period of inactivity.", "The part of the body that thinks."]},
          {"id": 22, "real": true, "name": "'Mind the Gap' Poster", "emoji": "⚠️", "messages": ["A deep state of unawareness.", "To cease motion or work.", "The front of the tube train."]},
          {"id": 23, "real": true, "name": "Stalled Tube Train", "emoji": "🚆", "messages": ["An interruption of wakefulness.", "A moment of stillness.", "The crown of a king."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 24, "real": false, "name": "Emergency Stop Button", "emoji": "🛑", "messages": ["A small, round device. (Ring)", "To take a break.", "Secured with a tight bolt. (Nut)"]},
          {"id": 25, "real": false, "name": "Disused Track Section", "emoji": "🛤️", "messages": ["A long, rusty rail. (Long)", "What a weary traveler needs.", "A small house for tracks. (Case)"]},
          {"id": 26, "real": false, "name": "Ticket Barrier (Locked)", "emoji": "🚏", "messages": ["Made of a long pole.", "To find peace.", "The point of entry. (Shaft)"]},
          {"id": 27, "real": false, "name": "Map's Compass Rose", "emoji": "🧭", "messages": ["Used for navigation on a voyage. (Docks)", "A much-needed repose.", "The most forward part of something."]},
          {"id": 28, "real": false, "name": "Passenger's Cap", "emoji": "🧢", "messages": ["Worn over the hair.", "A temporary unconsciousness.", "What a hat covers."]},
          {"id": 29, "real": false, "name": "Graffiti on the Wall", "emoji": "🧴", "messages": ["A long, painted message.", "A thick coating of colour. (Case)", "A strange, twisted image. (Screw)"]},
          {"id": 30, "real": false, "name": "Fluorescent Tube Light", "emoji": "💡", "messages": ["A long glass cylinder.", "A state of repose.", "Requires breath to cool down. (Air)"]}
        ]
      },
      {
        "name": "Docks",
        "emoji": "⚓",
        "location_code": "CASE",
        "fragment_codes": ["SHELL", "SKIN", "BOX"],
        "objects": [
          // REAL OBJECTS (Clues for SHELL, SKIN, BOX)
          {"id": 31, "real": true, "name": "Hermit Crab in a Tank", "emoji": "🦀", "messages": ["A protective outer layer.", "The surface you are wearing.", "A rectangular storage unit."]},
          {"id": 32, "real": true, "name": "Discarded Oyster Half", "emoji": "🦪", "messages": ["The exterior of a ballistic round.", "The largest organ of the body.", "A small container for jewelry."]},
          {"id": 33, "real": true, "name": "Hull of a Ship", "emoji": "🚢", "messages": ["A strong exoskeleton.", "The film on milk.", "A sturdy, lockable enclosure."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 34, "real": false, "name": "Fisherman's Wetsuit", "emoji": "🤿", "messages": ["A tight rubber suit. (Tight)", "A protective outer covering.", "A long garment."]},
          {"id": 35, "real": false, "name": "Peeling Paint Patch", "emoji": "🎨", "messages": ["Looks like a cracked gem. (Gem)", "What a snake sheds.", "A small piece of colour."]},
          {"id": 36, "real": false, "name": "Seal's Wet Fur", "emoji": "🦭", "messages": ["A covering for the body.", "The living boundary.", "A small cylinder. (Tube)"]},
          {"id": 37, "real": false, "name": "Shipping Container", "emoji": "📦", "messages": ["Made of heavy, rigid steel.", "A rough texture on the outside.", "A large storage box."]},
          {"id": 38, "real": false, "name": "Cargo Manifest", "emoji": "📃", "messages": ["A long list of items. (Long)", "A temporary break in action. (Rest)", "A simple paper container."]},
          {"id": 39, "real": false, "name": "Watchman's Booth", "emoji": "🛖", "messages": ["Secured by a nut and bolt.", "A period of deep rest. (Sleep)", "A confined space for a sentry."]},
          {"id": 40, "real": false, "name": "Mooring Rope", "emoji": "⚓", "messages": ["A complex knot of fibers. (Tight)", "Tied to a circular dock. (Ring)", "A long, twisted coil. (Screw)"]}
        ]
      },
      {
        "name": "Mansion",
        "emoji": "🏠",
        "location_code": "NUT",
        "fragment_codes": ["TIGHT", "SCREW", "LOCK"],
        "objects": [
          // REAL OBJECTS (Clues for TIGHT, SCREW, LOCK)
          {"id": 41, "real": true, "name": "A Vise Grip Tool", "emoji": "🛠️", "messages": ["To hold with great pressure.", "To twist two pieces of metal together.", "A mechanism that holds shut."]},
          {"id": 42, "real": true, "name": "Safecracker's Tool Kit", "emoji": "🧰", "messages": ["A strong, inflexible hold.", "To turn and drill.", "A deadlock."]},
          {"id": 43, "real": true, "name": "Main Gate's Hasp", "emoji": "🔓", "messages": ["Snug and secure.", "To rotate clockwise to advance.", "To prevent escape."]},
          // FAKE OBJECTS (Distraction messages)
          {"id": 44, "real": false, "name": "Grandfather Clock Winder", "emoji": "🕰️", "messages": ["Used to keep things from unwinding.", "To twist or turn something.", "A small metallic thread. (Screw)"]},
          {"id": 45, "real": false, "name": "Cinch Belt", "emoji": "🎗️", "messages": ["To pull something very close.", "A long strip of leather. (Long)", "A simple paper container. (Box)"]},
          {"id": 46, "real": false, "name": "Sealed Attic Door", "emoji": "🏠", "messages": ["Held rigidly in place.", "Found in a hidden passage. (Tube)", "The color of a rare stone. (Gem)"]},
          {"id": 47, "real": false, "name": "Bottle of Expensive Wine (Corked)", "emoji": "🍷", "messages": ["Used to contain a liquid. (Case)", "A threaded stopper.", "A secure closure."]},
          {"id": 48, "real": false, "name": "Guard Dog's Collar", "emoji": "🐕", "messages": ["A circular band for the neck. (Ring)", "A long leash is attached.", "A physical restraint."]},
          {"id": 49, "real": false, "name": "Old-Fashioned Telescope", "emoji": "🔭", "messages": ["Used to look far away. (Long)", "A long, twisted pin.", "Needs still air to work. (Air)"]},
          {"id": 50, "real": false, "name": "Tapestry of a Ship", "emoji": "🖼️", "messages": ["Woven fabric that covers a wall. (Skin)", "A complex knot of threads.", "Requires a strong frame. (Case)"]}
        ]
      }
    ]
  }
}
