import { useQuery } from "@tanstack/react-query";
import { CmsPageContent, fetchHomeContent, fetchMyTestimonials, fetchPageContent, fetchProjectBySlug, fetchProjects, fetchTestimonials, HomeContent, Project, ProjectsList, TestimonialsList } from "@/lib/content";

export function useHomeContent() {
	return useQuery<HomeContent, Error>({
		queryKey: ["home-content"],
		queryFn: ({ signal }) => fetchHomeContent(signal),
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
	});
}

export function useProjectsList() {
	return useQuery<ProjectsList, Error>({
		queryKey: ["projects-list"],
		queryFn: ({ signal }) => fetchProjects(signal),
		staleTime: 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
}

export function useProject(slug: string) {
	return useQuery<Project, Error>({
		queryKey: ["project", slug],
		queryFn: ({ signal }) => fetchProjectBySlug(slug, signal),
		enabled: slug.length > 0,
		staleTime: 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
}

export function useTestimonials() {
	return useQuery<TestimonialsList, Error>({
		queryKey: ["testimonials"],
		queryFn: ({ signal }) => fetchTestimonials(signal),
		staleTime: 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
}

export function useMyTestimonials(email?: string) {
	return useQuery<TestimonialsList, Error>({
		queryKey: ["my-testimonials", email],
		queryFn: ({ signal }) => fetchMyTestimonials(email ?? "", signal),
		enabled: Boolean(email),
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000,
	});
}

export function usePageContent(slug: string) {
	return useQuery<CmsPageContent | null, Error>({
		queryKey: ["page-content", slug],
		queryFn: ({ signal }) => fetchPageContent(slug, signal),
		enabled: slug.length > 0,
		staleTime: 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
}
