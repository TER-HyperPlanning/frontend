const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5075";

export type Building = {
    id: string;
    name: string;
};



// Recuperer les batiments
export async function getBuildings(): Promise<Building[]> {
    const res = await fetch(`${API_URL}/api/Buildings`); //retourne JSON
    const json = await res.json();
    return json.result;
}

// Ajout
export async function createBuilding(name: string) {
    const res = await fetch(`${API_URL}/api/Buildings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const json = await res.json();
    return json.result;
}

// Modiication
export async function updateBuilding(id: string, name: string) {
    const res = await fetch(`${API_URL}/api/Buildings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const json = await res.json();
    return json.result;
}

// Supression
export async function deleteBuilding(id: string) {
    const res = await fetch(`${API_URL}/api/Buildings/${id}`, {
        method: "DELETE",
    });

    const json = await res.json();
    return json.result;
}