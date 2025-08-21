// types.ts
// export interface IBreadcrumbPath {
//   label: string;
//   link: string | null;
// }
export interface IBreadcrumbPath {
  label: string;
  link?: string;
}

export interface IBreadcrumb {
  title: string;
  path: IBreadcrumbPath[];
}
