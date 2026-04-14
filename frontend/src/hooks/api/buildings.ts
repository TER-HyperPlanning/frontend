const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5075";

export type Building = {
    id: string;
    name: string;
};

// GET ALL
export async function getBuildings(): Promise<Building[]> {
    const res = await fetch(`${API_URL}/api/Buildings`);
    const json = await res.json();
    return json.result;
}

// CREATE
export async function createBuilding(name: string) {
    const res = await fetch(`${API_URL}/api/Buildings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const json = await res.json();
    return json.result;
}

// UPDATE
export async function updateBuilding(id: string, name: string) {
    const res = await fetch(`${API_URL}/api/Buildings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const json = await res.json();
    return json.result;
}

// DELETE
export async function deleteBuilding(id: string) {
    const res = await fetch(`${API_URL}/api/Buildings/${id}`, {
        method: "DELETE",
    });

    const json = await res.json();
    return json.result;
}