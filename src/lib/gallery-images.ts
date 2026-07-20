const unsplash = (photoId: string, alt: string) => ({
  src: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`,
  alt,
});

/** Curated appetizing food photos (pizza, shawarma, burgers, etc.) */
export const GALLERY_FOOD_IMAGES: { src: string; alt: string }[] = [
  unsplash("photo-1565299624946-b28f40a0ae38", "Wood-fired pizza"),
  unsplash("photo-1513104890138-7c749659a591", "Pepperoni pizza"),
  unsplash("photo-1574071318508-1cdbab80d002", "Fresh pizza slice"),
  unsplash("photo-1568901346375-23c9450c58cd", "Gourmet burger"),
  unsplash("photo-1550547660-d9450f859349", "Double cheeseburger"),
  unsplash("photo-1572802419224-296b0a2a2315", "Chicken burger"),
  unsplash("photo-1529006557810-274dbdd82af85", "Shawarma wrap"),
  unsplash("photo-1599487488170-d11ec9c172f0", "Grilled kebab"),
  unsplash("photo-1551782450-a2132b4ba21d", "Gourmet sandwich"),
  unsplash("photo-1555939594-58d7cb561ad1", "Grilled meats"),
  unsplash("photo-1573080496219-a992945447fa", "Crispy fries"),
  unsplash("photo-1608039255271-c4bdfb114f58", "Chicken wings"),
  unsplash("photo-1565299585323-38120c158726", "Tacos"),
  unsplash("photo-1621996346565-e3dbc646d659", "Creamy pasta"),
  unsplash("photo-1601057921230-64d207857a85", "Street food platter"),
  unsplash("photo-1606755962773-d324e166a853", "Loaded fries box"),
  unsplash("photo-1567620905732-2d1ec7ab7500", "Pancakes stack"),
  unsplash("photo-1504674900247-0877df9cc836", "Breakfast spread"),
];

function shuffle<T>(items: T[]): T[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export async function getGalleryImages(): Promise<{ src: string; alt: string }[]> {
  return shuffle(GALLERY_FOOD_IMAGES);
}
