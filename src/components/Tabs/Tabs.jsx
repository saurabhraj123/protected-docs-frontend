import TabItem from "./TabItem";
import classes from "./Tabs.module.css";

const Tabs = ({
  tabs,
  editableTabId,
  activeTabId,
  onTabChange,
  onTabEdit,
  onTabDelete,
  onCreateTab,
}) => {
  console.log("Tabs rendered");
  return (
    <div className={classes.tabsContainer}>
      {tabs.map((tab) => {
        return (
          <TabItem
            key={tab.id}
            id={tab.id}
            title={tab.title}
            isEditable={tab.id === editableTabId}
            activeTabId={activeTabId}
            onClick={onTabChange}
            onEdit={onTabEdit}
            onDelete={onTabDelete}
          />
        );
      })}
      <button
        className={classes.button}
        onClick={() => onCreateTab("Untitled")}
      >
        +
      </button>
    </div>
  );
};

export default Tabs;
