export type Tab = {
  label: string;
  value: string;
  content: React.ReactNode;
};

export interface TabsProps {
  tabs: Tab[];
  defaultTabIndex?: number;
}
