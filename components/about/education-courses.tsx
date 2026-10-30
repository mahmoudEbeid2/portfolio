import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { Course, EducationItem } from "@/lib/content";

type EducationCoursesProps = {
  education: readonly EducationItem[];
  courses: readonly Course[];
};

export function EducationCourses({ education, courses }: EducationCoursesProps) {
  return (
    <section aria-labelledby="education" className="reveal py-12">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <SectionTitle id="education" name="education" />
          <ul className="flex flex-col gap-4">
            {education.map((item) => (
              <Card as="li" key={item.degree}>
                <h3 className="border-b border-gray p-4 text-xl font-medium">{item.degree}</h3>
                <div className="flex flex-col gap-1 p-4">
                  <p>{item.school}</p>
                  <p className="text-white">
                    {item.start} — {item.end || "Present"}
                  </p>
                </div>
              </Card>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-8">
          <SectionTitle id="courses" name="courses" as="h2" />
          <ul className="flex flex-col gap-4">
            {courses.map((course) => (
              <Card as="li" key={course.name} className="gap-1 p-4">
                <h3 className="font-medium">{course.name}</h3>
                <p>
                  {course.instructor} · {course.platform} · {course.year}
                </p>
                <p className={course.status === "completed" ? "text-white" : "text-primary"}>
                  {course.status === "completed" ? "Completed" : "In progress"}
                </p>
              </Card>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
