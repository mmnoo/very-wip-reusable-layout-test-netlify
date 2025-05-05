import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutPanels } from "../couldBeSharedComponents/LayoutPanels/LayoutPanels";
import { LayoutApp } from "../couldBeSharedComponents/LayoutApp/LayoutApp";
import storyStyles from "./LayoutPanel.stories.module.scss";

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

const SubpanelDemo = (props: {
  leftPanelClassName?: string;
  rightPanelClassName?: string;
  subpanelClassName?: string;
}) => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isSubpanelOpen, setIsSubpanelOpen] = useState(true);

  return (
    <LayoutPanels
      leftPanelContent={
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
      subpanelContent={
        <div style={{ height: "100%", padding: "20px" }}>
          <h3>Subpanel Content</h3>
          <p>This is the subpanel content.</p>
        </div>
      }
      rightPanelContent={<RightPanelContent />}
      isLeftPanelOpen={isLeftPanelOpen}
      setIsLeftPanelOpen={setIsLeftPanelOpen}
      isLeftSubpanelOpen={isSubpanelOpen}
      setIsLeftSubpanelOpen={setIsSubpanelOpen}
      {...props}
    >
      {<MainContent />}
    </LayoutPanels>
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

export const CustomPanelStyles: Story = {
  render: () => (
    <SubpanelDemo
      leftPanelClassName={storyStyles.leftPanelOverride}
      rightPanelClassName={storyStyles.rightPanelOverride}
      subpanelClassName={storyStyles.subpanelOverride}
    />
  ),
};

export const WithSubpanel: Story = {
  render: () => <SubpanelDemo />,
};

const CustomToggleButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    style={{
      background: isOpen ? "magenta" : "cyan",
      color: "white",
      border: "none",
      padding: "5px",
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    {isOpen ? "x" : "o"}
  </button>
);

const CustomToggleButtonsDemo = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  return (
    <LayoutApp>
      <LayoutPanels
        leftPanelContent={<LeftPanelContent />}
        rightPanelContent={<RightPanelContent />}
        children={<MainContent />}
        isLeftPanelOpen={isLeftPanelOpen}
        isRightPanelOpen={isRightPanelOpen}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
        leftPanelToggleButton={
          <CustomToggleButton
            isOpen={isLeftPanelOpen}
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          />
        }
        rightPanelToggleButton={
          <CustomToggleButton
            isOpen={isRightPanelOpen}
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          />
        }
        isLeftPanelResizable={true}
        isRightPanelResizable={true}
      />
    </LayoutApp>
  );
};

export const WithCustomToggleButtons: Story = {
  render: () => <CustomToggleButtonsDemo />,
};
