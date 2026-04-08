package com.music.melodix.service;

import com.music.melodix.dto.SongResponse;
import com.music.melodix.model.Favorite;
import com.music.melodix.model.Song;
import com.music.melodix.model.User;
import com.music.melodix.repository.FavoriteRepository;
import com.music.melodix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final SongService songService;

    public String toggleFavorite(Long songId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (favoriteRepository.existsByUserIdAndSongId(user.getId(), songId)) {
            Favorite fav = favoriteRepository.findByUserIdAndSongId(user.getId(), songId)
                    .orElseThrow();
            favoriteRepository.delete(fav);
            return "Eliminado de favoritos";
        } else {
            Song song = songService.getSongById(songId);
            Favorite fav = new Favorite();
            fav.setUser(user);
            fav.setSong(song);
            favoriteRepository.save(fav);
            return "Agregado a favoritos";
        }
    }

    public List<SongResponse> getUserFavorites(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return favoriteRepository.findByUserId(user.getId())
                .stream().map(fav -> {
                    Song song = fav.getSong();
                    SongResponse sr = new SongResponse();
                    sr.setId(song.getId());
                    sr.setTitle(song.getTitle());
                    sr.setArtist(song.getArtist());
                    sr.setAlbum(song.getAlbum());
                    sr.setGenre(song.getGenre());
                    sr.setDuration(song.getDuration());
                    sr.setPlays(song.getPlays());
                    sr.setStreamUrl("/api/songs/" + song.getId() + "/stream");
                    return sr;
                }).collect(Collectors.toList());
    }

    public boolean isFavorite(Long songId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return favoriteRepository.existsByUserIdAndSongId(user.getId(), songId);
    }
}