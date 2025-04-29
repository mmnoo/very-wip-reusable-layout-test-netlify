import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutPanels } from "../couldBeSharedComponents/LayoutPanels/LayoutPanels";
import { PanelContentsWithSubpanel } from "../PanelContentsWithSubpanel/PanelContentsWithSubpanel";
import { useCloseSubpanelWhenParentPanelCloses } from "../PanelContentsWithSubpanel/useCloseSubpanelWhenParentPanelCloses";
import styles from "./LayoutPanel.stories.module.scss";
import { LayoutApp } from "../couldBeSharedComponents/LayoutApp/LayoutApp";

const meta: Meta<typeof LayoutPanels> = {
  title: "Components/LayoutPanels",
  component: LayoutPanels,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LayoutPanels>;

const LeftPanelContent = () => (
  <div style={{ padding: "20px" }}>
    <h2>Left Panel</h2>
    <p>This is the left panel content.</p>
  </div>
);

const RightPanelContent = () => (
  <div style={{ padding: "20px" }}>
    <h2>Right Panel</h2>
    <p>This is the right panel content.</p>
  </div>
);

const MainContent = () => (
  <div style={{ padding: "20px", height: "100vh", background: "#f0f0f0" }}>
    <h1>Main Content</h1>
    <p>This is the main content area.</p>
  </div>
);

const SubpanelDemo = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isSubpanelOpen, setIsSubpanelOpen] = useState(true);

  useCloseSubpanelWhenParentPanelCloses({
    isLeftPanelOpen,
    setIsSubpanelOpen,
  });

  return (
    <LayoutPanels
      leftPanelContent={
        <PanelContentsWithSubpanel
          isSubpanelOpen={isSubpanelOpen}
          setIsSubpanelOpen={setIsSubpanelOpen}
          subpanelContents={
            <div style={{ height: "100%", padding: "20px" }}>
              <h3>Subpanel Content</h3>
              <p>This is the subpanel content that slides in from the right.</p>
            </div>
          }
          mainPanelContents={
            <div style={{ padding: "20px" }}>
              <h2>Main Panel</h2>
              <p>This is the main panel content.</p>
              <button onClick={() => setIsSubpanelOpen(!isSubpanelOpen)}>
                Toggle Subpanel
              </button>
              <br />
              <br />
            </div>
          }
        />
      }
      rightPanelContent={<RightPanelContent />}
      children={<MainContent />}
      isLeftPanelOpen={isLeftPanelOpen}
      setIsLeftPanelOpen={setIsLeftPanelOpen}
    />
  );
};

export const Default: Story = {
  args: {
    leftPanelContent: <LeftPanelContent />,
    rightPanelContent: <RightPanelContent />,
    children: <MainContent />,
  },
};

export const LeftPanelOnly: Story = {
  args: {
    leftPanelContent: <LeftPanelContent />,
    children: <MainContent />,
    isLeftPanelResizable: true,
  },
};

export const RightPanelOnly: Story = {
  args: {
    rightPanelContent: <RightPanelContent />,
    children: <MainContent />,
    isRightPanelResizable: true,
  },
};

export const Resizable: Story = {
  args: {
    leftPanelContent: <LeftPanelContent />,
    rightPanelContent: <RightPanelContent />,
    children: <MainContent />,
    isLeftPanelResizable: true,
    isRightPanelResizable: true,
  },
};

export const CustomWidth: Story = {
  args: {
    leftPanelContent: <LeftPanelContent />,
    rightPanelContent: <RightPanelContent />,
    children: <MainContent />,
    isLeftPanelResizable: true,
    isRightPanelResizable: true,
    leftPanelClassName: styles.leftPanelOverride,
  },
};

export const WithSubpanel: Story = {
  render: () => <SubpanelDemo />,
};
