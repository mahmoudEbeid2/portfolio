export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** A list row as the dashboard edits it: strings and string lists only. */
export type AdminItem = { id: string } & Record<string, string | string[]>;

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
};

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};
