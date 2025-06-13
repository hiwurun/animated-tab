import React from "react";
import { Tabs, type Tab } from "@/components/Tabs";

const tabs: Tab[] = [
  {
    label: "Home",
    value: "home",
    content: (
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>欢迎访问首页</h2>
        <p>这是一个精美的动画标签页示例。</p>
      </div>
    ),
  },
  {
    label: "About",
    value: "about",
    content: (
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>关于我们</h2>
        <p>了解更多关于我们的信息。</p>
      </div>
    ),
  },
  {
    label: "Contact",
    value: "contact",
    content: (
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>联系我们</h2>
        <p>如何与我们取得联系。</p>
      </div>
    ),
  },
  {
    label: "Danger",
    value: "danger",
    content: (
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>危险区域</h2>
        <p>请谨慎操作。</p>
      </div>
    ),
  },
];

function App() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-white'>
      <div className='w-[500px]'>
        <Tabs tabs={tabs} defaultTabIndex={0} />
      </div>
    </div>
  );
}

export default App;
