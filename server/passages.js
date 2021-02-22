/*passages = [
    "Later that evening in an izakaya in Ginza over beer and yakitori, Mrs. Matsuda, slightly drunk, admitted to Mrs. Nakamoto that her husband beat her. He would come home from work, eat his food in silence, read the newspaper's sports section and, after neatly folding it, would nod his head. Mrs. Matsuda would strip naked, bend over a chair and Mr. Matsuda, taking a three-foot bamboo cane from the kitchen cupboard, would issue a dozen lashes to Mrs. Matsuda's buttocks. …  Looking up, she smiled and in a voice Mrs. Nakamoto could barely hear Mrs. Matsuda said that she was embarrassed to admit it but, yes, she quite enjoyed it.",
    "Three or four goats appear and start following them. They frighten him as they get closer with their horns, bells tinkling. She laughs at him. He's embarrassed. Kathleen knows goats. They had them on the farm in Galway.",
    "She sheds her shyness in the open countryside. She wants to make love al fresco. There is no one about except for the goats. She breathes in deeply the fragrance of the pines. Lying down on the scorched earth, she loosens her blouse, drawing him into her. 'Is it possible, Michael? Say it's possible.'",
    "My father was born at the height of clouds. He entered the world wailing, lungs pumping the mountain air and desperate for oxygen. He lived because he had the breath of a Kalenjin, as had his father and his grandfather before, a long line of proud and noble descendants from the ancient tribe of highlanders from the hills of the Great Rift Valley.",
    "He grew up at an altitude where visiting relatives from the lowlands fainted and had to sit and take a rest from the sky. A village where the rhythm of life was set by the stars and the moon, the sun and the rain, a village where horseless cowboys herded the cattle, and my father and his brothers ran down the strays barefoot.",
    "Like all Kalenjin boys he ran everywhere. He ran to school. He ran home from school. He ran to gather firewood. He ran to the river to fetch water and spilt none running back. He ran but did not race. Running was not a sport. It was a way of life.",
    "The word felt terrible in her mouth, something fell away as she said it; halved and fell like a fleshy fruit – an overripe babaco. She tasted the sweet, slightly putrid hit at its core. My twin, she hadn't wanted to say it, she hadn't wanted to let it out, she hadn't wanted it to escape from her body and lose it forever. But Alison had made her say it. As if someone living, breathing in the world could be blind to the simple fact that Deborah had been her twin.",
    "Across the street from my building, men replace the swamp cooler of an expensive restaurant with air conditioning. They drill. It scares the birds away. The windows framed by the thin walls of my apartment shake. I have to listen to it when I come home from work.",
    "For a while it shuffled gimpishly about. Then it stopped. Only its eyes twitched, aware that it was being watched. And people did glance at it as they passed, with disgust and embarrassment, hoping it would go away so they wouldn't have to deal with it.",
    "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.",
    "You can tell yourself that you would be willing to lose everything you have in order to get something you want. But it's a catch-22: all of those things you're willing to lose are what make you recognizable. Lose them, and youve lost yourself",
    "The only people for me are the mad ones, the ones who are mad to live, mad to talk, mad to be saved, desirous of everything at the same time, the ones who never yawn or say a commonplace thing, but burn, burn, burn like fabulous yellow roman candles exploding like spiders across the stars.",
    "He allowed himself to be swayed by his conviction that human beings are not born once and for all on the day their mothers give birth to them, but that life obliges them over and over again to give birth to themselves.",
    "There is an idea of a Patrick Bateman, some kind of abstraction, but there is no real me, only an entity, something illusory, and though I can hide my cold gaze and you can shake my hand and feel flesh gripping yours and maybe you can even sense our lifestyles are probably comparable: I simply am not there.",
    "Sometimes I can hear my bones straining under the weight of all the lives I'm not living.",
    "It doesn't interest me what you do for a living. I want to know what you ache for, and if you dare to dream of meeting your heart's longing."
]*/

const passages = [
    `Your Midas touch on the Chevy door, November flush and your flannel cure, "This dorm was once a madhouse", I made a joke, "Well, it's made for me", How evergreen, our group of friends, Don't think we'll say that word again, And soon they'll have the nerve to deck the halls, That we once walked through, One for the money, two for the show, I never was ready so I watch you go, Sometimes you just don't know the answer, 'Til someone's on their knees and asks you, "She would've made such a lovely bride, What a shame she's fucked in the head," they said, But you'll find the real thing instead, She'll patch up your tapestry that I shred`,
    `The moments of my true story on that album are songs like "Delicate," "New Year’s Day," "Call It What You Want," "Dress." The one-two punch, bait-and-switch of Reputation is that it was actually a love story. It was a love story in amongst chaos. All the weaponized sort of metallic battle anthems were what was going on outside.`,
    `I used to be like a golden retriever, just walking up to everybody, like, wagging my tail. "Sure, yeah, of course! What do you want to know? What do you need?" Now, I guess, I have to be a little bit more like a fox.`,
    `It was the best of times, the worst of crimes, I struck a match and blew your mind, But I didn't mean it, And you didn’t see it, The ties were black, the lies were white, In shades of gray in candlelight, I wanted to leave him, I needed a reason.`
]

/*const passages = [
    "This is just for testing purposes",
    "This is also just for testing purposes"
]*/

const getPassage = () => {
    return passages[Math.floor(Math.random()*passages.length)]    
}


exports.getPassage = getPassage