import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useRouter } from 'next/navigation';

interface PermissionControlProps {
  permissions: Record<string, boolean>;
  setPermissions: (perms: Record<string, boolean>) => void;
  onNext: () => void;
}
const PermissionControl = ({ permissions, setPermissions, onNext }: PermissionControlProps) => {
  // const [permissions, setPermissions] = useState<any>({})
  console.log("permissions:", permissions);
  
  const router = useRouter()
  const permissionData = [
    {
      key: "dashboard",
      title: "Dashboard"
    },
    {
      key: "crm",
      title: "CRM / Sales",
      children: ["Leads", "Queries", "Confirmed Queries", "B2C Customer(s)", "B2B Customer(s)", "My Suppliers", "Archived Leads"],
    },
    {
      key: "marketing",
      title: "Marketing",
      children: ["Dashboard", "Lists", "Email Marketing", "Campaigns",
        "Default Campaigns",
        "Manage Landing Page",
        "Campaign URL Builder",
        "View Feedback",
        "Coupon Code",
        "Meta Integration",],
    },
    {
      key: "operations",
      title: "Operations",
      children: ["WIP Packages", "Flight Modifications", "Refund Upgrade",
        "Flights Booking Queue",
        "Proposal Requested",
        "Supplier Package Enquiry"],
    },
    {
      key: "todos",
      title: "To Do's"
    },
    {
      key: "inventory",
      title: "My Inventory",
      children: [
        "Packages",
        "Hotels",
        "Sightseeing",
        "Vehicles",
        "Transport Rates",
        "Visa",
        "Itinerary Description",
        "Group Departure",
        "Area Master",
        "Restaurants",
      ],
    },
    {
      key: "reports",
      title: "Reports",
      children: [
        "Query Status Report (Count)",
        "Query Status Report (Value)",
        "Sourcewise Lead Report",
        "Staff Wise Report",
        "Destination Wise Report",
        "Campaign Success Report",
        "B2B Report",
        "CheckIn Report",
        "Checkout Report",
        "Debtors Report",
        "DCR Report",
      ],
    },
    {
      key: "bookings",
      title: "Bookings",
      children: [
        "Packages",
        "Flights Ticket",
        "Hotels",
        "Activities",
        "Visa",
        "Transfer",
      ],
    },
    {
      key: "finance",
      title: "Finance",
      children: [
        "Proforma Invoice",
        "Daily Collection",
        "My Wallet History",
        "Sales Report",
        "Booking Reports",
        "Lead/Query Follow Up Report",
        "Invoice",
        "Credit Note",
        "B2C Customer",
        "TCS Collection Report",
        "Tax Collection Report",
        "Reward Points",
      ],
    },
    {
      key: "marketplace",
      title: "Marketplace",
      children: [
        "My Offers",
        "Deals Hub",
        "My Published Package",
      ],
    },
    {
      key: "staff_management",
      title: "Staff Management",
      children: [
        "Roles",
        "Department",
        "Staff",
      ],
    },
    {
      key: "settings",
      title: "Settings",
      children: [
        "Company Profile",
        "Term & Conditions",
        "Email Templates",
        "Mark Ups",
        "Lead Source",
        "Manage Notifications",
        "Communications",
        "Subscription Plan",
        // "Global Settings",
      ],
    },
    {
      key: "refer_earn",
      title: "Refer & Earn",
    },
    {
      key: "other_settings",
      title: "Other Settings",
      children: [
        "Full Masking",
        "Show Supplier",
        "Modify Proposals Post Sales",
        "Hide Sales & Profit In Fulfillment",
        "Lock/Unlock Full File In Fulfillment",
        "File Lock/Unlock (Ex-Voucher)",
        "Hide Inventory Package Edit / Delete",
        "Auto-approve Payment",
      ],
    }
  ];

  // Helper: check parent based on children also
  const isParentChecked = (section: any) => {
    return (
      permissions[section.key] ||
      section.children?.some(
        (item: string) => permissions[`${section.key}.${item}`]
      )
    );
  };

  // Toggle parent (with children)
  const handleParentChange = (section: any, checked: boolean) => {
    const updated = { ...permissions };

    updated[section.key] = checked;

    section.children?.forEach((item: string) => {
      updated[`${section.key}.${item}`] = checked;
    });

    setPermissions(updated);
  };

  // Toggle child
  const handleChildChange = (section: any, item: string, checked: boolean) => {
    const updated = { ...permissions };

    updated[`${section.key}.${item}`] = checked;

    setPermissions(updated);
  };

  // const parentChecked = isParentChecked(section);

  return (
    <>
      <Form>
        <b>Permission Control </b>
        <Row className="mb-2 mt-2">
          <div>
            {permissionData.map((section) => {
              const parentChecked = isParentChecked(section); // ✅ NOW it's valid

              return (
                <div key={section.key} className="mb-3">

                  <Form.Check
                    type="checkbox"
                    label={section.title}
                    checked={parentChecked || false}
                    onChange={(e) =>
                      handleParentChange(section, e.target.checked)
                    }
                    style={{ fontWeight: "bold", fontSize: "13px" }}
                  />

                  {section.children && parentChecked && (
                    <div className="mt-2 ms-3 d-flex flex-wrap gap-3">
                      {section.children.map((item) => {
                        const childKey = `${section.key}.${item}`;

                        return (
                          <Form.Check
                            key={childKey}
                            type="checkbox"
                            label={item}
                            checked={permissions[childKey] || false}
                            onChange={(e) =>
                              handleChildChange(
                                section,
                                item,
                                e.target.checked
                              )
                            }
                            style={{ fontSize: "12px" }}
                          />
                        );
                      })}
                    </div>
                  )}

                  <hr />
                </div>
              );
            })}
          </div>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => router.push('./')}
            style={{ fontSize: "10px" }}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            size="sm"
            style={{ fontSize: "10px" }}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </Form>
    </>
  )
}

export default PermissionControl
