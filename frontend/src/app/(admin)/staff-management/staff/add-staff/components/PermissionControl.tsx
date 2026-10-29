import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useRouter } from 'next/navigation';

type PermissionControlProps = {
  onNext: (permissions: string[]) => void;
};

// type PermissionControlProps={
//    onNext: () => void;
// }
const PermissionControl = ({ onNext }: PermissionControlProps) => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({})
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

  const handleParentChange = (key: string, checked: boolean, children?: string[]) => {
    if (checked) {
      setPermissions((prev: any) => ({
        ...prev,
        [key]: children ? [...children] : [], // auto select all children
      }));
    } else {
      const updated = { ...permissions };
      delete updated[key];
      setPermissions(updated);
    }
  };

  // ✅ Child toggle
  const handleChildChange = (key: string, item: string, checked: boolean) => {
    const current = permissions[key] || [];

    if (checked) {
      setPermissions({
        ...permissions,
        [key]: [...current, item],
      });
    } else {
      setPermissions({
        ...permissions,
        [key]: current.filter((i: string) => i !== item),
      });
    }
  };

  // Convert + send to parent
  const handleNext = () => {
    const flatPermissions: string[] = [];
    Object.entries(permissions).forEach(([key, children]: [string, string[]]) => {
      if (children.length === 0) {
        flatPermissions.push(key);
      } else {
        children.forEach((child: string) => {
          flatPermissions.push(`${key}:${child}`);
        });
      }
    });

    onNext(flatPermissions);
  };

  return (
    <>
      <Form>
        <b>Permission Control </b>
        <Row className="mb-2 mt-2">
          <div>
            {permissionData.map((section) => (
              <div key={section.key} className="mb-3">

                {/* Parent */}
                <Form.Check
                  type="checkbox"
                  label={section.title}
                  checked={!!permissions[section.key]}
                  onChange={(e) =>
                    handleParentChange(
                      section.key,
                      e.target.checked,
                      section.children
                    )
                  }
                  style={{ fontWeight: "bold", fontSize: "13px" }}
                />

                {/* Children */}
                {permissions[section.key] && section.children && (
                  <div className="mt-2 ms-3 d-flex flex-wrap gap-3">
                    {section.children.map((item, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={item}
                        checked={
                          permissions[section.key]?.includes(item) || false
                        }
                        onChange={(e) =>
                          handleChildChange(
                            section.key,
                            item,
                            e.target.checked
                          )
                        }
                        style={{ fontSize: "12px" }}
                      />
                    ))}
                  </div>
                )}

                <hr />
              </div>
            ))}
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
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </Form>
    </>
  )
}

export default PermissionControl
