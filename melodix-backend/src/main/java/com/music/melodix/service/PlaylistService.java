package com.music.melodix.service;

import com.music.melodix.dto.PlaylistRequest;
import com.music.melodix.dto.PlaylistResponse;
import com.music.melodix.dto.SongResponse;
import com.music.melodix.model.Playlist;
import com.music.melodix.model.Song;
import com.music.melodix.model.User;
import com.music.melodix.repository.PlaylistRepository;
import com.music.melodix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final SongService songService;

    public PlaylistResponse createPlaylist(PlaylistRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Playlist playlist = new Playlist();
        playlist.setName(request.getName());
        playlist.setDescription(request.getDescription());
        playlist.setUser(user);

        return toResponse(playlistRepository.save(playlist));
    }

    public List<PlaylistResponse> getUserPlaylists(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return playlistRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PlaylistResponse getPlaylistById(Long id) {
        return toResponse(playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist no encontrada")));
    }

    public PlaylistResponse addSongToPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist no encontrada"));

        Song song = songService.getSongById(songId);

        if (!playlist.getSongs().contains(song)) {
            playlist.getSongs().add(song);
            playlistRepository.save(playlist);
        }

        return toResponse(playlist);
    }

    public PlaylistResponse removeSongFromPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist no encontrada"));

        playlist.getSongs().removeIf(song -> song.getId().equals(songId));
        playlistRepository.save(playlist);

        return toResponse(playlist);
    }

    public void deletePlaylist(Long id) {
        playlistRepository.deleteById(id);
    }

    private PlaylistResponse toResponse(Playlist playlist) {
        PlaylistResponse response = new PlaylistResponse();
        response.setId(playlist.getId());
        response.setName(playlist.getName());
        response.setDescription(playlist.getDescription());
        response.setCreatedAt(playlist.getCreatedAt());

        List<SongResponse> songs = playlist.getSongs() == null ? List.of() :
                playlist.getSongs().stream().map(song -> {
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

        response.setSongs(songs);
        response.setTotalSongs(songs.size());
        return response;
    }
}