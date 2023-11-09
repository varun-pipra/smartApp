import {
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import "./UserBadgeCard.scss";

interface UserBadgeCardProps {
  userDetails?: any;
  cardView?: string;
}

const SUIUserBadgeCard = (props: UserBadgeCardProps) => {
  const { userDetails, cardView = "front" } = props;

  return (
    <div>
      <div className="badger-card-header">
        <Card className="card">
          <CardContent className="card-body-content"
          >
            <CardMedia
              component="img"
              style={{width:'100%'}}
              image={userDetails}
            />
            <CardContent>
            </CardContent>
          </CardContent>
        </Card>
      </div>
      <div className="viewcard">
        {cardView === "front" ? "Front Side" : "Back Side"}
      </div>
    </div>
  );
};

export default SUIUserBadgeCard;
