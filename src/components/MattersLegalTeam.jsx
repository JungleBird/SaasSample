import { employees } from "../data/people/employees";
import ContentTable from "./displayElements/ContentTable";
import ExpandedRowPeopleBody from "./displayElements/ExpandedRowPeopleBody";

const MattersLegalTeam = ({ matter }) => {
  // For now, display all in-house legal staff
  const personnel = employees
    .filter((e) => e.entityId === null)
    .map((person) => ({
      ...person,
      role: "Team Member",
    }));

  const columns = [
    { key: "role", header: "ROLE" },
    { 
      key: "name", 
      header: "NAME", 
      color: "#008fa1", 
      fontWeight: "bold",
      expandable: true,
    },
    { key: "title", header: "TITLE" },
    { key: "phone", header: "PHONE" },
    {
      key: "actions",
      header: "",
      width: "80px",
      type: "actions",
      actions: [
        { icon: "📝", title: "Edit" },
        { icon: "✉", title: "Email" },
        { icon: "📝", title: "Note" },
      ],
    },
  ];

  const renderExpandedContent = (item) => (
    <ExpandedRowPeopleBody item={item} />
  );

  return (
    <div className="content-block">
      <div className="block-header">
        <h3>LEGAL TEAM</h3>
      </div>

      <div className="block-content">
        <ContentTable
          columns={columns}
          data={personnel}
          striped
          renderExpandedContent={renderExpandedContent}
        />
      </div>
    </div>
  );
};

export default MattersLegalTeam;
