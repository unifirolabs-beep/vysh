// Collection metadata: banner + display info + gallery per slug
export interface CollectionInfo {
  heading: string;
  about: string;
  stylingTips: string[];
  careInstructions: string[];
  faqs: { q: string; a: string }[];
}

export interface BannerTextOverlay {
  badge: string;
  headline: string;
  subline: string;
  cta?: string;
}

export interface CollectionMeta {
  slug: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  categoryName: string; // matches Product.category exactly
  categorySlug: string; // matches Product.categorySlug exactly
  badgeLabel?: string;
  textOverlay?: BannerTextOverlay; // optional left-side text on hero banner
  galleryImages: string[];
  info: CollectionInfo;
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    slug: "new-arrivals",
    title: "Fresh Drops",
    subtitle: "Shop The New Edit",
    bannerImage: "/new-arrival/banner-new-arrival.png",
    categoryName: "New Arrivals",
    categorySlug: "new-arrivals",
    badgeLabel: "Just Dropped",
    galleryImages: [
      "/category-cards/new-arrivals.png",
      "/category-cards/rings.png",
      "/category-cards/earrings.png",
    ],
    info: {
      heading: "New Arrivals — The Latest from Vysh",
      about:
        "Our New Arrivals collection showcases the finest freshly crafted pieces from Vysh's design atelier. Each season, our master craftsmen bring forth new expressions of beauty in hallmarked 925 Sterling Silver.",
      stylingTips: [
        "Layer new arrival pieces with your existing Vysh collection for a curated look.",
        "Mix metals thoughtfully — silver pairs beautifully with rose gold accents.",
        "New arrival statement pieces shine best when worn as the focal point of an outfit.",
      ],
      careInstructions: [
        "Store in the provided anti-tarnish pouch when not wearing.",
        "Clean gently with a soft silver polishing cloth.",
        "Avoid contact with perfume, lotions, and chlorine water.",
      ],
      faqs: [
        { q: "How often does Vysh add new arrivals?", a: "We refresh our new arrivals every 2–4 weeks with fresh designs from our Jaipur atelier." },
        { q: "Are new arrivals limited edition?", a: "Many are! New arrivals are crafted in limited batches to ensure exclusivity." },
        { q: "Do new arrivals come with authenticity certification?", a: "Yes — every piece includes a BIS Hallmark and Vysh authenticity card." },
      ],
    },
  },
  {
    slug: "rakhis",
    title: "Pure Silver Rakhis",
    subtitle: "Celebrate the Sacred Bond",
    bannerImage: "/hero-page-banners/rakhi-banner.png",
    categoryName: "Rakhis",
    categorySlug: "rakhis",
    badgeLabel: "Raksha Bandhan",
    textOverlay: {
      badge: "✦ Raksha Bandhan 2026",
      headline: "Pure Silver\nRakhis",
      subline: "Handcrafted in 925 Sterling Silver\nFor a Bond That Shines Forever",
      cta: "Shop the Collection",
    },
    galleryImages: [
      "/category-cards/rakhi.png",
      "/category-cards/charm-duo.png",
      "/category-cards/bracelets.png",
    ],
    info: {
      heading: "Rakhis — Crafted in 925 Pure Silver",
      about:
        "Vysh Rakhis are more than threads — they are heirlooms. Handcrafted in hallmarked 925 Sterling Silver by master artisans in Jaipur, each Rakhi carries the weight of tradition and the shimmer of royalty.",
      stylingTips: [
        "Pair a silver Rakhi with a matching silver bracelet for a coordinated festive look.",
        "Silver Rakhis complement both traditional kurtas and fusion western outfits.",
        "Layer multiple slim Rakhis for a stacked festival bracelet effect.",
      ],
      careInstructions: [
        "Store in the royal velvet pouch provided with each Rakhi.",
        "Polish gently with a soft silver cloth to maintain shine.",
        "Keep away from water, perfumes, and chemicals.",
        "Silver Rakhis can be preserved as keepsakes long after Raksha Bandhan.",
      ],
      faqs: [
        { q: "Are Vysh Rakhis made of real silver?", a: "Yes — all Vysh Rakhis are hallmarked 925 (92.5%) Sterling Silver, certified by BIS." },
        { q: "Can I get a Rakhi customized?", a: "Yes! Visit our Customized Rakhi section to engrave names and add photos." },
        { q: "What thread is used?", a: "We use premium handspun silk thread in traditional festival colors — red, gold, and maroon." },
      ],
    },
  },
  {
    slug: "earrings",
    title: "Silver Earrings",
    subtitle: "From Subtle to Statement",
    bannerImage: "/ear rings/banner-earrings.png",
    categoryName: "Earrings",
    categorySlug: "earrings",
    galleryImages: [
      "/category-cards/earrings.png",
      "/category-cards/charm-duo.png",
      "/category-cards/new-arrivals.png",
    ],
    info: {
      heading: "Earrings — Silver That Speaks",
      about:
        "From delicate CZ studs to grand chandelier drops, Vysh's earring collection in 925 Sterling Silver is designed for every occasion — from everyday elegance to wedding grandeur.",
      stylingTips: [
        "Stud earrings pair perfectly with casual western wear for an effortless look.",
        "Long drop earrings complement Indian ethnic wear and lehengas beautifully.",
        "Hoop earrings styled with a silk kurta create a chic festive look.",
      ],
      careInstructions: [
        "Remove earrings before swimming or bathing.",
        "Store each pair separately to avoid scratching.",
        "Polish with a soft dry cloth after each use.",
      ],
      faqs: [
        { q: "Are the earrings hypoallergenic?", a: "Yes — 925 Sterling Silver is safe for sensitive ears. Rhodium-plated variants add extra protection." },
        { q: "Do you have push-back and screw-back options?", a: "Yes, both are available. Check each product listing for the back type." },
        { q: "Can I return earrings if they don't suit me?", a: "Earrings are returnable within 15 days if unused and in original packaging." },
      ],
    },
  },
  {
    slug: "charm-duo",
    title: "Charm Duo Sets",
    subtitle: "Perfect Pairs for Perfect Bonds",
    bannerImage: "/charm dwo/bannercharm.png",
    categoryName: "Charm Duo",
    categorySlug: "charm-duo",
    badgeLabel: "Gifting Special",
    galleryImages: [
      "/category-cards/charm-duo.png",
      "/category-cards/bracelets.png",
      "/category-cards/earrings.png",
    ],
    info: {
      heading: "Charm Duo — Silver Sets for Two",
      about:
        "Charm Duo is Vysh's signature gifting line — paired silver jewellery sets designed for two. Perfect for best friends, couples, or sisters, each set is crafted in matching 925 Sterling Silver.",
      stylingTips: [
        "Wear matching charm bracelets with a best friend as a friendship statement.",
        "Couple charm rings look beautiful in minimalist everyday styling.",
        "Gift a Charm Duo set in our royal packaging for an unforgettable gifting moment.",
      ],
      careInstructions: [
        "Store each piece in the provided soft pouch.",
        "Clean gently with a silver polishing cloth.",
        "Avoid exposing charms to harsh chemicals.",
      ],
      faqs: [
        { q: "Can Charm Duo pieces be customized?", a: "Yes! Names and initials can be engraved on most Charm Duo pieces." },
        { q: "Are Charm Duo sets sold together or separately?", a: "They are sold as a complete set for the best gifting value." },
        { q: "Do you offer gift wrapping for Charm Duo?", a: "Yes — each Charm Duo ships in our signature royal box with ribbon and authenticity card." },
      ],
    },
  },
  {
    slug: "chains",
    title: "Silver Chains",
    subtitle: "Everyday Elegance in Pure Silver",
    bannerImage: "/chains/banner.png",
    categoryName: "Chains",
    categorySlug: "chains",
    galleryImages: [
      "/category-cards/chain.png",
      "/category-cards/necklaces.png",
      "/category-cards/new-arrivals.png",
    ],
    info: {
      heading: "Chains — 925 Silver for Every Wrist & Neck",
      about:
        "From delicate paperclip links to bold curb chains, Vysh's silver chain collection in hallmarked 925 Sterling Silver is crafted to complement every style — minimalist, classic, or bold.",
      stylingTips: [
        "Layer a thin box chain with a medium curb chain for a trendy stacked look.",
        "A single bold silver chain elevates a plain white shirt instantly.",
        "Men's chains pair perfectly with casual and semi-formal outfits.",
      ],
      careInstructions: [
        "Unclasp and store chains flat to avoid tangling.",
        "Polish regularly with a silver polishing cloth.",
        "Avoid wearing chains while exercising or swimming.",
      ],
      faqs: [
        { q: "What lengths are available for chains?", a: "We offer chains in 16\", 18\", 20\", and 22\" lengths. Length is mentioned in each product description." },
        { q: "Are chains anti-tarnish?", a: "Yes — all Vysh chains are treated with an anti-tarnish rhodium coating." },
        { q: "Can I add a pendant to any chain?", a: "Yes! All Vysh chains have a standard pendant loop compatible with our pendants collection." },
      ],
    },
  },
  {
    slug: "rings",
    title: "Silver Rings",
    subtitle: "Wear Your Story",
    bannerImage: "/rings/banner-rings.png",
    categoryName: "Rings",
    categorySlug: "rings",
    galleryImages: [
      "/category-cards/rings.png",
      "/category-cards/new-arrivals.png",
      "/category-cards/earrings.png",
    ],
    info: {
      heading: "Rings — 925 Sterling Silver Craftsmanship",
      about:
        "Vysh rings are crafted to last a lifetime. Whether you choose a bold statement ring or a delicate everyday band, every ring in our collection is made in hallmarked 925 Sterling Silver.",
      stylingTips: [
        "Stack multiple slim bands on one finger for a modern stacked ring look.",
        "A bold cocktail ring is best worn alone as the statement piece of the outfit.",
        "Midi rings (worn on the middle joint) are trending — try with minimalist bands.",
      ],
      careInstructions: [
        "Remove rings before washing hands, swimming, or applying creams.",
        "Polish with a dry silver cloth regularly.",
        "Store rings in individual velvet pouches to prevent scratching.",
      ],
      faqs: [
        { q: "How do I find my ring size?", a: "Use our online ring size guide or visit any Vysh store for a complimentary sizing." },
        { q: "Can rings be resized?", a: "Most silver rings can be resized ±1 size. Contact our care team for details." },
        { q: "Are Vysh rings suitable as engagement rings?", a: "Absolutely! Our solitaire and CZ rings are popular for proposals and engagements." },
      ],
    },
  },
  {
    slug: "bracelets",
    title: "Silver Bracelets",
    subtitle: "Wrap Your Wrist in Luxury",
    bannerImage: "/bracelets/banner.png",
    categoryName: "Bracelets",
    categorySlug: "bracelets",
    galleryImages: [
      "/category-cards/bracelets.png",
      "/category-cards/bangles.png",
      "/category-cards/charm-duo.png",
    ],
    info: {
      heading: "Bracelets — Silver Adornments for Every Wrist",
      about:
        "From dainty tennis bracelets to bold cuff bracelets, Vysh's 925 Sterling Silver bracelet collection is designed to complement every mood, occasion, and outfit.",
      stylingTips: [
        "Stack 2–3 slim bracelets for a layered arm party look.",
        "A single bold cuff bracelet pairs well with a kurta or formal dress.",
        "Mix silver with gold-toned bangles for a contemporary mixed-metal look.",
      ],
      careInstructions: [
        "Remove bracelets before exercising, sleeping, or swimming.",
        "Clasp open when storing to maintain the clasp mechanism.",
        "Polish with a soft silver cloth every 2–4 weeks.",
      ],
      faqs: [
        { q: "What sizes are available for bracelets?", a: "We offer Small (6.5\"), Medium (7\"), and Large (7.5\") lengths for most bracelets." },
        { q: "Can bracelets be extended?", a: "Yes — most Vysh bracelets include an extension chain of 1–2 inches." },
        { q: "Do you offer men's bracelets?", a: "Yes! Our men's bracelet collection features bold chains, kadas, and cuff designs." },
      ],
    },
  },
  {
    slug: "cufflinks",
    title: "Silver Cufflinks",
    subtitle: "Dress Sharp, Stay Royal",
    bannerImage: "/cufflinks/banner-cufflinks.png",
    categoryName: "Cufflinks",
    categorySlug: "cufflinks",
    badgeLabel: "Men's Collection",
    galleryImages: [
      "/category-cards/cufflinks.png",
      "/category-cards/rings.png",
      "/category-cards/watches.png",
    ],
    info: {
      heading: "Cufflinks — The Gentleman's Silver Statement",
      about:
        "Vysh silver cufflinks are the perfect finishing touch for the modern gentleman. Crafted in hallmarked 925 Sterling Silver, each pair blends traditional motifs with contemporary design.",
      stylingTips: [
        "Silver cufflinks pair classically with a white dress shirt and navy suit.",
        "Oxidized silver cufflinks add a vintage edge to formal wedding attire.",
        "For festive occasions, pair gold-plated silver cufflinks with a sherwani.",
      ],
      careInstructions: [
        "Store cufflinks in the provided velvet box when not in use.",
        "Polish occasionally with a silver cloth to maintain luster.",
        "Avoid contact with cologne or aftershave directly on the cufflinks.",
      ],
      faqs: [
        { q: "What shirt types are cufflinks compatible with?", a: "Vysh cufflinks are compatible with French cuffs (double cuffs) and convertible cuffs." },
        { q: "Do cufflinks come in gift packaging?", a: "Yes — all cufflinks ship in a royal velvet box with authenticity card." },
        { q: "Are cufflinks available in gold plating?", a: "Yes — many designs are available in 18K gold plating over 925 Silver." },
      ],
    },
  },
  {
    slug: "necklaces",
    title: "Silver Necklaces",
    subtitle: "Adorn Your Neckline",
    bannerImage: "/necklaces/neckless-banner .png",
    categoryName: "Necklaces",
    categorySlug: "necklaces",
    galleryImages: [
      "/category-cards/necklaces.png",
      "/category-cards/chain.png",
      "/category-cards/new-arrivals.png",
    ],
    info: {
      heading: "Necklaces — Heritage to Modern in 925 Silver",
      about:
        "From minimalist solitaire pendants to grand layered necklaces, Vysh's silver necklace collection spans the full spectrum of jewellery aesthetics — always in hallmarked 925 Sterling Silver.",
      stylingTips: [
        "A delicate solitaire pendant necklace is perfect for everyday wear.",
        "Layer necklaces of varying lengths for an editorial, on-trend look.",
        "A statement choker necklace complements deep neckline outfits beautifully.",
      ],
      careInstructions: [
        "Store necklaces flat or hung to prevent tangling.",
        "Polish with a silver polishing cloth regularly.",
        "Remove before sleeping, swimming, or applying skincare.",
      ],
      faqs: [
        { q: "What chain lengths are available for necklaces?", a: "16\", 18\", and 20\" lengths are standard. Custom lengths are available on request." },
        { q: "Can I customize the pendant on a Vysh necklace?", a: "Yes — many pendants can be personalized with initials, names, or dates." },
        { q: "Are Vysh necklaces suitable as wedding jewellery?", a: "Our grand necklace and heritage choker designs are popular bridal picks." },
      ],
    },
  },
  {
    slug: "bangles",
    title: "Silver Bangles",
    subtitle: "The Sound of Elegance",
    bannerImage: "/bangles/banglesbanner.png",
    categoryName: "Bangles",
    categorySlug: "bangles",
    galleryImages: [
      "/bangles/banglesbanner.png",
      "/category-cards/bangles.png",
      "/category-cards/bracelets.png",
    ],
    info: {
      heading: "Bangles — 925 Silver in Every Tradition",
      about:
        "Vysh silver bangles blend Indian tradition with modern design. Each bangle is crafted in hallmarked 925 Sterling Silver, available in oxidized, rhodium-plated, and gold-plated finishes.",
      stylingTips: [
        "Stack 4–8 slim bangles for a traditional festive look.",
        "A single broad cuff bangle makes a powerful modern statement.",
        "Combine oxidized silver bangles with a silk saree for a classic ethnic look.",
      ],
      careInstructions: [
        "Store bangles flat in the velvet tray provided.",
        "Polish with a soft silver cloth every few weeks.",
        "Remove before heavy manual work or dishwashing.",
      ],
      faqs: [
        { q: "What bangle sizes does Vysh offer?", a: "We offer sizes 2.4, 2.6, 2.8, and 2.10 (standard Indian sizing). Custom sizes available." },
        { q: "Are Vysh bangles adjustable?", a: "Most designs are fixed size. Open-cuff bangles are adjustable for a flexible fit." },
        { q: "Can bangles be engraved?", a: "Yes — personalized engraving is available for wider band bangle designs." },
      ],
    },
  },
  {
    slug: "watches",
    title: "Luxury Silver Watches",
    subtitle: "Timepieces of Royal Distinction",
    bannerImage: "/watches/watchbanner.png",
    categoryName: "Watches",
    categorySlug: "watches",
    badgeLabel: "Royal Collection",
    galleryImages: [
      "/watches/watchbanner.png",
      "/category-cards/watches.png",
      "/category-cards/cufflinks.png",
    ],
    info: {
      heading: "Luxury Watches — Precision Wrapped in Pure 925 Silver",
      about:
        "Vysh Luxury Silver Watches combine Swiss quartz movement with hand-crafted 925 Sterling Silver cases and bracelet straps. Designed for royalty and built for timeless durability.",
      stylingTips: [
        "Pair a silver bracelet watch with tailored formal suits or festive sherwanis.",
        "Stack a minimalist silver watch with thin silver cuffs for a contemporary luxury look.",
        "Choose a mother-of-pearl dial watch to add subtle sheen to evening dresses.",
      ],
      careInstructions: [
        "Water-resistant up to 30m; avoid prolonged submersion.",
        "Store in the signature Vysh watch box when not wearing.",
        "Clean case and strap gently with a soft micro-fiber silver polishing cloth.",
      ],
      faqs: [
        { q: "Are Vysh watches made of real silver?", a: "Yes — the watch case, bezel, and bracelet strap are crafted in hallmarked 925 Sterling Silver." },
        { q: "What warranty comes with Vysh watches?", a: "Every Vysh watch includes a 2-Year International Warranty card." },
        { q: "Can links be removed for sizing?", a: "Yes — complimentary strap sizing is included with every order." },
      ],
    },
  },
  {
    slug: "anklets",
    title: "Silver Anklets",
    subtitle: "Grace with Every Step",
    bannerImage: "/anklets/banneranklet.png",
    categoryName: "Anklets",
    categorySlug: "anklets",
    galleryImages: [
      "/category-cards/anklets.png",
      "/category-cards/bangles.png",
      "/category-cards/bracelets.png",
    ],
    info: {
      heading: "Anklets — Silver Grace for Your Every Step",
      about:
        "Vysh silver anklets are crafted to adorn the ankle with timeless elegance. Available in delicate chains, traditional ghunghroo styles, and modern charm anklets — all in hallmarked 925 Sterling Silver.",
      stylingTips: [
        "A single delicate chain anklet pairs beautifully with ethnic wear and sarees.",
        "Double anklets on both feet look stunning with western summer outfits.",
        "Ghunghroo (bell charm) anklets add a festive touch to dance and celebration outfits.",
      ],
      careInstructions: [
        "Remove anklets before entering the pool, sea, or shower.",
        "Polish regularly with a silver polishing cloth.",
        "Avoid wearing anklets during intense physical activity.",
      ],
      faqs: [
        { q: "What lengths are Vysh anklets available in?", a: "Standard 9\" and 10\" lengths with an extension chain for adjustable fit." },
        { q: "Are anklets gender-neutral?", a: "Yes — Vysh offers unisex minimal chain anklet designs popular with men and women." },
        { q: "Can anklets be personalized?", a: "Yes — name and initial charm anklets are available for personalization." },
      ],
    },
  },
  {
    slug: "pendants",
    title: "Silver Pendants",
    subtitle: "Carry What Matters",
    bannerImage: "/pendants/pendent-banner.png",
    categoryName: "Pendants",
    categorySlug: "pendants",
    galleryImages: [
      "/category-cards/pendent.png",
      "/category-cards/chain.png",
      "/category-cards/necklaces.png",
    ],
    info: {
      heading: "Pendants — Stories in Silver",
      about:
        "Each Vysh pendant tells a story — from sacred Om and Ganesha motifs to modern geometric and initial pendants. Crafted in hallmarked 925 Sterling Silver with rhodium or gold plating.",
      stylingTips: [
        "Wear a single meaningful pendant on a thin chain for a minimalist everyday look.",
        "Layer pendants of different lengths and designs for a curated layered necklace effect.",
        "Religious pendants look timeless on a classic 18\" silver chain.",
      ],
      careInstructions: [
        "Polish pendant regularly with a soft silver cloth.",
        "Remove before showering or swimming.",
        "Store pendants separately from chains to prevent tangling.",
      ],
      faqs: [
        { q: "Do Vysh pendants come with a chain?", a: "Some pendants include a chain; others are sold separately. Check each product listing." },
        { q: "Can I get a custom pendant made?", a: "Yes — we offer custom pendant design services. Contact our team for details." },
        { q: "Are religious pendants available for gifting?", a: "Yes — Om, Ganesha, Cross, and Hamsa pendants are popular gifting choices." },
      ],
    },
  },
  {
    slug: "mangalsutra",
    title: "Silver Mangalsutra",
    subtitle: "A Bond Beautifully Worn",
    bannerImage: "/mangalsutra/bammermangalsutra.png",
    categoryName: "Mangalsutra",
    categorySlug: "mangalsutra",
    galleryImages: [
      "/category-cards/mangalsutra.png",
      "/category-cards/necklaces.png",
      "/category-cards/chain.png",
    ],
    info: {
      heading: "Mangalsutra — The Sacred Symbol in 925 Silver",
      about:
        "Vysh Mangalsutras celebrate the sacred bond of marriage in hallmarked 925 Sterling Silver. Our collection spans traditional black bead designs to modern lightweight mangalsutras for daily wear.",
      stylingTips: [
        "A lightweight modern mangalsutra pairs seamlessly with western and casual outfits.",
        "Traditional multi-strand black bead mangalsutras complement sarees and heavy ethnic wear.",
        "Pair a mangalsutra with a matching silver necklace for a layered bridal look.",
      ],
      careInstructions: [
        "Handle the black beads gently — avoid pulling or stretching.",
        "Polish the silver pendant carefully with a soft cloth.",
        "Store flat or hung to prevent tangling of beads and chain.",
        "Avoid contact with perfume or chemicals near the pendant.",
      ],
      faqs: [
        { q: "Are Vysh Mangalsutras suitable for daily wear?", a: "Yes — our modern lightweight designs are crafted specifically for comfortable daily wear." },
        { q: "What lengths are available?", a: "We offer 16\", 18\", and 22\" lengths to suit different necklines and preferences." },
        { q: "Can I customize my Mangalsutra?", a: "Yes — initial and name engraving is available on the pendant of select designs." },
      ],
    },
  },
];

export function getCollectionBySlug(slug: string): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
