import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
// import { AiOutlineApi } from "react-icons/ai";

const Sidebar = ({ items }) => {
  const [open, setOpen] = useState(null);

  const handleOpen = (value) => {
    // setOpen(open === value ? 0 : value);
    setOpen(value);
  };
  return (
    <Card className="fixed top-8 no-scrollbar overflow-y-scroll overflow-x-hidden left-0 h-[calc(100vh-2rem)] w-full max-w-[20rem] px-0 py-4 shadow-xl shadow-blue-gray-900/5">
      {/* {JSON.stringify(items, null, 2)} */}
      <div className="pt-2 px-4">
        <Typography variant="h6" color="blue-gray" className="font-bold">
          menu
        </Typography>
      </div>
      {items?.length > 0 &&
        items.map((item, index) => (
          <List key={index} className="px-2 py-0">
            <Accordion
              open={open === index}
              icon={
                <HiChevronDown
                  className={`mx-auto h-5 w-5 transition-transform ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem>
                <AccordionHeader
                  onClick={() => handleOpen(index)}
                  className="border-b-0 p-0"
                >
                  <ListItemPrefix>{item.prefixIcon}</ListItemPrefix>
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                    className="mr-auto font-normal text-sm"
                  >
                    {item?.headerTitle}
                  </Typography>
                </AccordionHeader>
              </ListItem>

              <AccordionBody className="py-1" key={index}>
                <List className="p-0 ">
                  {item?.items?.length > 0 &&
                    item.items.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item?.route}
                        className="text-sm hover:bg-gray-50"
                      >
                        {({ isActive }) => (
                          <ListItem
                            className={
                              isActive
                                ? "text-teal-500 font-bold active:text-teal-400 focus:text-teal-400 hover:text-teal-400 hover:bg-gray-100"
                                : "hover:bg-gray-100"
                            }
                          >
                            <ListItemPrefix>
                              <HiChevronRight className="h-3 w-4" />
                            </ListItemPrefix>
                            {item?.title}
                          </ListItem>
                        )}
                      </NavLink>
                    ))}
                </List>
              </AccordionBody>
            </Accordion>
          </List>
        ))}
    </Card>
  );
};

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      headerTitle: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          route: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          icon: PropTypes.elementType,
        })
      ),
    })
  ),
};

export default Sidebar;
