export type HomeContent = {
	heroHeading1: string;
	heroHeading2: string;
	heroSubtitle: string;
	heroCtas: Array<{ label: string; href: string; variant?: "outline" | "default" }>;
	serviceIcons: Array<{ label: string; icon: "Code" | "Smartphone" | "Palette" | "Settings" }>;
	services: Array<{
		icon: "Code" | "Smartphone" | "Palette" | "Settings";
		title: string;
		description: string;
		features: string[];
		colorFrom: string;
		colorTo: string;
	}>;
};

type HomePageApiResponse = {
	sections?: Array<{
		key: string;
		payload?: Record<string, unknown>;
	}>;
};

export type CmsPageContent = {
	slug: string;
	title?: string;
	seoTitle?: string;
	seoDescription?: string;
	sections: Array<{
		key: string;
		name?: string;
		position?: number;
		payload?: Record<string, unknown>;
	}>;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
	const response = await fetch(url, { signal, headers: { "cache-control": "no-cache" } });
	if (!response.ok) {
		throw new Error(`Request failed: ${response.status}`);
	}
	return (await response.json()) as T;
}

function toHomeContentFromPage(page: HomePageApiResponse): HomeContent {
	const merged = (page.sections ?? []).reduce<Record<string, unknown>>((acc, section) => {
		if (section.payload) {
			Object.assign(acc, section.payload);
		}
		return acc;
	}, {});

	return merged as HomeContent;
}

function toCmsPageContent(page: CmsPageContent): CmsPageContent {
	return {
		slug: page.slug,
		title: page.title,
		seoTitle: page.seoTitle,
		seoDescription: page.seoDescription,
		sections: page.sections ?? [],
	};
}

export async function fetchHomeContent(signal?: AbortSignal): Promise<HomeContent> {
	if (API_BASE_URL) {
		try {
			const page = await fetchJson<HomePageApiResponse>(`${API_BASE_URL}/api/v1/pages/home`, signal);
			return toHomeContentFromPage(page);
		} catch {
			// Fallback keeps frontend running if backend is unavailable.
		}
	}

	return fetchJson<HomeContent>("/content/home.json", signal);
}

export async function fetchPageContent(slug: string, signal?: AbortSignal): Promise<CmsPageContent | null> {
	if (!API_BASE_URL) return null;

	try {
		const page = await fetchJson<CmsPageContent>(`${API_BASE_URL}/api/v1/pages/${slug}`, signal);
		return toCmsPageContent(page);
	} catch {
		return null;
	}
}

export type Project = {
	title: string;
	slug: string;
	summary: string;
	publishedAt?: string;
	cover?: string;
	gallery?: string[];
	tags?: string[];
	body?: string;
};

export type ProjectsList = {
	projects: Project[];
};

export type Testimonial = {
	id?: number;
	name: string;
	email?: string;
	role?: string;
	avatar?: string;
	content: string;
	rating: number;
	isApproved?: boolean;
	createdAt?: string;
};

export type TestimonialsList = {
	testimonials: Testimonial[];
};

type WrappedResponse<T> = {
	data?: T;
};

export async function fetchProjects(signal?: AbortSignal): Promise<ProjectsList> {
	if (API_BASE_URL) {
		try {
			return await fetchJson<ProjectsList>(`${API_BASE_URL}/api/v1/projects`, signal);
		} catch {
			// Fallback keeps frontend running if backend is unavailable.
		}
	}

	return fetchJson<ProjectsList>('/content/projects/list.json', signal);
}

function normalizeProject(project: Project & { gallery?: unknown; date?: string }): Project {
	const normalizedGallery = Array.isArray(project.gallery)
		? project.gallery
				.map((item) => {
					if (typeof item === "string") return item;
					if (item && typeof item === "object" && "image" in item) {
						const image = (item as { image?: unknown }).image;
						return typeof image === "string" ? image : null;
					}
					return null;
				})
				.filter((item): item is string => typeof item === "string" && item.length > 0)
		: [];

	return {
		...project,
		publishedAt: project.publishedAt ?? project.date,
		gallery: normalizedGallery,
	};
}

export async function fetchProjectBySlug(slug: string, signal?: AbortSignal): Promise<Project> {
	if (API_BASE_URL) {
		try {
			const project = await fetchJson<Project | WrappedResponse<Project>>(`${API_BASE_URL}/api/v1/projects/${slug}`, signal);
			const normalized = "data" in project && project.data ? project.data : (project as Project);
			return normalizeProject(normalized);
		} catch {
			// Fallback keeps frontend running if backend is unavailable.
		}
	}

	const project = await fetchJson<Project>(`/content/projects/${slug}.json`, signal);
	return normalizeProject(project);
}

export async function fetchTestimonials(signal?: AbortSignal): Promise<TestimonialsList> {
	if (API_BASE_URL) {
		return fetchJson<TestimonialsList>(`${API_BASE_URL}/api/v1/testimonials`, signal);
	}

	return { testimonials: [] };
}

export async function submitTestimonial(payload: Omit<Testimonial, "id" | "isApproved" | "createdAt">): Promise<void> {
	if (!API_BASE_URL) throw new Error("API base URL is not configured.");

	const response = await fetch(`${API_BASE_URL}/api/v1/testimonials`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error("Failed to submit testimonial.");
	}
}

export async function fetchMyTestimonials(email: string, signal?: AbortSignal): Promise<TestimonialsList> {
	if (!API_BASE_URL || !email) return { testimonials: [] };
	const query = new URLSearchParams({ email });
	return fetchJson<TestimonialsList>(`${API_BASE_URL}/api/v1/testimonials/mine?${query.toString()}`, signal);
}
