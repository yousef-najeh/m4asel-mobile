import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { bookmarksService } from "@/src/services/bookmarks.service";

type Coords = { lat: number; lng: number } | null;

/**
 * The signed-in customer's bookmarked washers.
 *
 * The backend computes distance/availability from the user's coordinates and
 * requires `lat`/`lng`, so we resolve location first and only fire the request
 * once we have coordinates. `locationDenied` lets the screen prompt the user
 * when permission is unavailable. Also exposes `remove` to un-bookmark a washer,
 * refreshing the list on success.
 */
export function useBookmarks() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [coords, setCoords] = useState<Coords>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== Location.PermissionStatus.GRANTED) {
          if (active) setLocationDenied(true);
          return;
        }
        let loc = await Location.getLastKnownPositionAsync();
        if (!loc) {
          loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
        }
        if (active && loc) {
          setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        }
      } catch {
        if (active) setLocationDenied(true);
      }
    })();
    return () => { active = false; };
  }, []);

  const query = useQuery({
    queryKey: ["bookmarks", coords?.lat, coords?.lng],
    queryFn: () => bookmarksService.list(coords!.lat, coords!.lng),
    enabled: isAuthenticated && coords !== null,
  });

  const removeMutation = useMutation({
    mutationFn: (washerId: number) => bookmarksService.remove(washerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  // Still waiting on location (not yet resolved and not denied) → keep showing the loader.
  const isResolvingLocation = coords === null && !locationDenied;

  return {
    ...query,
    isLoading: query.isLoading || isResolvingLocation,
    locationDenied,
    remove: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
  };
}
